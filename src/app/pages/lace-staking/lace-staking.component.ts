import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BaseSubscriberComponent } from '@core/base-subscriber-component';
import { StakingService } from '@core/services/staking/staking.service';
import { StakingData } from '@shared/interfaces';
import { AuthStore } from '@shared/services/stores';
import { takeUntil, tap } from 'rxjs/operators';
import { StakingPools } from '@shared/constants/staking.contstant';


@Component({
  selector: 'app-lace-staking',
  templateUrl: './lace-staking.component.html',
  styleUrls: ['./lace-staking.component.scss']
})
export class LaceStakingComponent extends BaseSubscriberComponent implements OnInit {

  public isFinished = false;
  public laceData: StakingData;
  public lpData: StakingData;
  public currentAddress: string;

  public pools = StakingPools;

  constructor(
    private authStore: AuthStore,
    private stakingservice: StakingService,
    private cdr: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit(): void {
    this.authStore.accountChanged.pipe(
      takeUntil(this.notifier),
      tap(async (account) => {
        if (account[0]) {
          // const stakingContract = this.stakingservice.getStakingContract();
          // const laceContract = this.stakingservice.getLaceContract();
          // const lpStakingContract = this.stakingservice.getLpStakingContract();
          // const lpContract = this.stakingservice.getLpContract();
   
          // this.currentAddress = account[0];
          // this.pools[0]['stakingData'] = await this.stakingservice.getDefaultData(stakingContract, laceContract, account[0]);
          // this.pools[1]['stakingData'] = await this.stakingservice.getDefaultData(lpStakingContract, lpContract, account[0]);
          // this.cdr.detectChanges();
        }
      })
    ).subscribe();
  }

  public get isEth(): boolean {
    return this.authStore.ethEnabled;
  }

  public get account(): string {
    return this.authStore.userAccount;
  }

  public async getUpdateDataAction(event) {
    console.log("getUpdateDataAction")
    const stakingContract = this.stakingservice.getStakingContract();
    const laceContract = this.stakingservice.getLaceContract();
    const lpStakingContract = this.stakingservice.getLpStakingContract();
    const lpContract = this.stakingservice.getLpContract();

    this.pools[0]['stakingData'] = await this.stakingservice.getDefaultData(stakingContract, laceContract, this.currentAddress);
    this.pools[1]['stakingData'] = await this.stakingservice.getDefaultData(lpStakingContract, lpContract, this.currentAddress);

    this.cdr.detectChanges();
  }


}
