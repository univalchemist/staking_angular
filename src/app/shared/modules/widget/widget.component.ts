import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { BaseSubscriberComponent } from '@core/base-subscriber-component';
import { convertToDecimals, normalizeValue } from '@core/bignumber';
import { UserInfo } from '@core/services/staking/interfaces';
import { StakingService } from '@core/services/staking/staking.service';
import { AuthStore } from '@shared/services/stores';
import { UtilsService } from '@shared/services/utils.service';
import { forkJoin, Subscription } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import Web3 from 'web3';
import { ConnectModalService } from '../connect-modal/services/connect-modal.service';
import moment from 'moment';

@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidgetComponent
  extends BaseSubscriberComponent
  implements OnInit, OnDestroy
{
  @Output() public updateData = new EventEmitter();
  @Input() public data;

  public currentAllowance: string;
  public currentAddress: string;
  public currentTokenValue = '0';
  public isIncreaseNeeded: boolean;
  public currentLoadingProcess = '';
  public isSuccessAction: boolean;
  public lastSuccessAction = '';
  public currentTokenType = '';

  public currentAction = '';

  public currentData = null;
  public currentApy = null;
  public currentReward = null;

  public resetInput = false;
  public inputError = '';

  maxUnstakeVal: string;
  unstakeData: { cooldownPeriod: number; userInfo: UserInfo } = null;
  percent: number = 0;

  public get loggedIn(): boolean {
    return this.authStore.isLoggedInUser && this.isEth && !!this.account;
  }

  private _unstakeDataSub: Subscription;

  constructor(
    private authStore: AuthStore,
    private cdr: ChangeDetectorRef,
    private stakingService: StakingService,
    private utilsService: UtilsService,
    private connectModalService: ConnectModalService
  ) {
    super();
  }

  ngOnDestroy(): void {
    if (this._unstakeDataSub && !this._unstakeDataSub.closed) {
      this._unstakeDataSub.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.currentTokenType = this.data.type;
    this.authStore.accountChanged
      .pipe(
        takeUntil(this.notifier),
        tap(async (account) => {
          if (account[0]) {
            this.currentAddress = account[0];
            await this.defaultData();
            // if (this.data.type === 'lace') {
            //   this.currentApy = await this.stakingService.getLaceApy(this.stakingService.getContractByAddress(this.data.stakingAddress), this.currentAddress);
            // } else if (this.data.limit) {
            //   this.currentApy = await this.stakingService.getLimitedApy(this.stakingService.getContractByAddress(this.data.stakingAddress), '');
            //   this.currentReward = await this.stakingService.getLimitedPoolReward(this.stakingService.getContractByAddress(this.data.stakingAddress), this.currentAddress);
            // } else {
            this.currentApy = await this.stakingService.getApy(
              this.stakingService.getContractByAddress(this.data.stakingAddress)
            );
            // }

            this.cdr.detectChanges();
          }
        })
      )
      .subscribe();
  }

  public get isEth(): boolean {
    return this.authStore.ethEnabled;
  }

  public get account(): string {
    return this.authStore.userAccount;
  }

  public action(action: string) {
    this.currentAction = action;

    if (action === 'unstake') {
      this.getUnstakeData();
    } else {
      this.unstakeData = null;
      this.maxUnstakeVal = null;
    }

    this.cdr.detectChanges();
  }

  public getUnstakeData(): void {
    const toBN = (value: string | number) => this.utilsService.toBN(value);

    if (this._unstakeDataSub && !this._unstakeDataSub.closed) {
      this._unstakeDataSub.unsubscribe();
    }

    this._unstakeDataSub = forkJoin([
      this.stakingService.getCooldownPeriod(
        this.stakingService.getContractByAddress(this.data.stakingAddress),
        this.currentAddress
      ),
      this.stakingService.getUsersInfo(
        this.stakingService.getContractByAddress(this.data.stakingAddress),
        this.currentAddress
      ),
    ])
      .pipe(takeUntil(this.notifier))
      .subscribe(([cooldownPeriod, userInfo]) => {
        // unlocked tokens  = staked - locked + locked * (current time - lastUpdate) / cooldownPeriod
        const { staked, locked, lastUpdate } = userInfo;
        const currentUTCTime = moment().utc(false).valueOf();
        const diffSinceLastUpdate = toBN(currentUTCTime).minus(
          +lastUpdate * 1000
        );

        if (diffSinceLastUpdate.lt(cooldownPeriod)) {
          const unlockedTokens = toBN(staked)
            .minus(locked)
            .plus(
              toBN(locked)
                .multipliedBy(diffSinceLastUpdate)
                .dividedBy(cooldownPeriod)
            );
          this.maxUnstakeVal = normalizeValue(unlockedTokens);
          this.percent = unlockedTokens
            .multipliedBy(100)
            .dividedBy(staked)
            .toNumber();
        } else {
          this.maxUnstakeVal = this.getMaxUnstakeVal();
        }

        this.unstakeData = { cooldownPeriod, userInfo };

        this.currentAction = 'unstake';

        this.cdr.markForCheck();
      });
  }

  getMaxUnstakeVal(): string {
    if (!this.unstakeData) {
      return '0';
    }

    return this.checkIsFullyUnlockedUnstake()
      ? this.utilsService.convertFrom(this.unstakeData.userInfo.locked)
      : this.calculateMaxUnstakeValue();
  }

  getPeriodInDays(periodInMs: number): number {
    if (!periodInMs) {
      return 0;
    }

    const msInOneDay = 86400000;
    const days = periodInMs / msInOneDay;

    return days > 0 ? days : 0;
  }

  getPercentsForPeriod(): number {
    const percentsPerDay =
      100 / this.getPeriodInDays(this.unstakeData?.cooldownPeriod) / 100;

    return (
      this.getPeriodInDays(this.getDifferentBetweenLastUpdateAndCurrentTime()) *
      percentsPerDay
    );
  }

  calculateMaxUnstakeValue() {
    const valInWei = Web3.utils.fromWei(
      Web3.utils
        .toBN(this.unstakeData.userInfo.locked)
        .muln(this.getPercentsForPeriod())
    );

    return valInWei;
  }

  public getDifferentBetweenLastUpdateAndCurrentTime(): number {
    if (!this.unstakeData?.userInfo?.lastUpdate) {
      return 0;
    }

    // TODO get UTC time
    return Date.now() - +this.unstakeData.userInfo.lastUpdate * 1000;
  }

  public checkIsFullyUnlockedUnstake(): boolean {
    if (
      !this.unstakeData?.userInfo?.lastUpdate ||
      !this.unstakeData.cooldownPeriod
    ) {
      return false;
    }

    return (
      this.getDifferentBetweenLastUpdateAndCurrentTime() >
      this.unstakeData.cooldownPeriod
    );
  }

  public getStakeValueChange(event: number, action: string = 'stake'): void {
    if (event) {
      this.currentTokenValue = event.toString();
      this.isIncreaseNeeded = Number(this.currentAllowance) < event;
    } else {
      this.currentTokenValue = '0';
      this.isIncreaseNeeded = Number(this.currentAllowance) < event;
    }

    this.cdr.markForCheck();

    if (action !== 'stake') {
      this.getUnstakeData();
    }
  }

  public async approve() {
    this.isSuccessAction = false;
    this.lastSuccessAction = '';
    this.resetInput = false;
    this.currentLoadingProcess = 'INCREASING';
    this.cdr.detectChanges();

    const increaseAloowanceResult = await this.stakingService.increaseAllowance(
      this.currentAddress,
      this.utilsService.convertTo(this.currentTokenValue),
      this.data.stakingAddress,
      this.stakingService.getContractByAddress(this.data.tokenAddress)
    );

    if (increaseAloowanceResult) {
      this.isIncreaseNeeded = false;
      this.currentAllowance = this.currentTokenValue;
      this.lastSuccessAction = 'INCREASE';
      this.cdr.detectChanges();
    }

    this.currentLoadingProcess = '';
    this.cdr.detectChanges();
  }

  public async stake() {
    this.isSuccessAction = false;
    this.resetInput = false;
    this.currentAllowance = this.utilsService.convertFrom(
      await this.stakingService.getAllowance(
        this.currentAddress,
        this.data.stakingAddress,
        this.stakingService.getContractByAddress(this.data.tokenAddress)
      )
    );
    this.currentLoadingProcess = 'STAKING';
    this.cdr.detectChanges();
    if (!this.isIncreaseNeeded) {
      const stakingResult = await this.stakingService.stake(
        this.currentAddress,
        this.utilsService.convertTo(this.currentTokenValue),
        this.stakingService.getContractByAddress(this.data.stakingAddress)
      );

      if (stakingResult) {
        this.isSuccessAction = true;
        this.resetInput = true;
        this.lastSuccessAction = 'STAKING';
        await this.back();
      }
    }

    this.currentLoadingProcess = '';
    this.cdr.detectChanges();
  }

  public async defaultData() {
    console.log("***************defaultData*************")
    this.currentAllowance = this.utilsService.convertFrom(
      await this.stakingService.getAllowance(
        this.currentAddress,
        this.data.stakingAddress,
        this.stakingService.getContractByAddress(this.data.tokenAddress)
      )
    );

    console.log({ stakingAddress: this.data.stakingAddress, tokenAddress: this.data.tokenAddress, currentAddress: this.currentAddress, limit: this.data.limit})
    this.currentData = await this.stakingService.getDefaultData(
      this.stakingService.getContractByAddress(this.data.stakingAddress),
      this.stakingService.getContractByAddress(this.data.tokenAddress),
      this.currentAddress,
      this.data.limit
    );
    console.log("***************this.currentData*************")
    console.log(this.currentData)

    this.cdr.detectChanges();
  }

  public async unstake() {
    this.isSuccessAction = false;
    this.resetInput = false;
    this.currentLoadingProcess = 'UNSTAKING';
    this.cdr.markForCheck();

    const stakingResult = await this.stakingService.unstake(
      this.currentAddress,
      convertToDecimals(this.currentTokenValue),
      this.stakingService.getContractByAddress(this.data.stakingAddress)
    );

    if (stakingResult) {
      this.isSuccessAction = true;
      this.resetInput = true;
      this.lastSuccessAction = 'UNSTAKING';
    }

    this.currentLoadingProcess = '';
    this.cdr.detectChanges();

    await this.back();
  }

  public async collect() {
    this.currentLoadingProcess = 'COLLECTING';
    this.cdr.detectChanges();
    const stakingResult = await this.stakingService.collect(
      this.stakingService.getContractByAddress(this.data.stakingAddress),
      this.currentAddress
    );

    if (stakingResult) {
      this.lastSuccessAction = 'COLLECTING';
      this.currentData = await this.stakingService.getDefaultData(
        this.stakingService.getContractByAddress(this.data.stakingAddress),
        this.stakingService.getContractByAddress(this.data.tokenAddress),
        this.currentAddress,
        this.data.limit
      );
      this.isSuccessAction = true;
      this.cdr.detectChanges();
    }

    this.currentLoadingProcess = '';
    this.cdr.detectChanges();
  }

  public async back() {
    await this.defaultData();
    this.lastSuccessAction = '';
    this.currentAction = '';
    this.isSuccessAction = false;
    this.cdr.detectChanges();
  }

  public connectWallet(): void {
    this.connectModalService.open().pipe(takeUntil(this.notifier)).subscribe();
  }

  public getInputError(event: string): void {
    this.inputError = event;
    this.cdr.detectChanges();
  }

  isDisableStake(cap: string, total: string): boolean {
    if (!cap || !total) {
      return false;
    }

    const capBn = this.utilsService.toBN(cap).minus(1);
    const totalBn = this.utilsService.toBN(total);

    return capBn.lt(totalBn) || capBn.eq(totalBn);
  }
}
