import { BreakpointObserver } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BaseSubscriberComponent } from '@core/base-subscriber-component';
import { BLOCKCHAIN_WORKSPACES } from '@shared/enums';
import { AuthStore } from '@shared/services/stores/auth-new.store';
import { BlockChainNetwork } from '@shared/types/blockchain-network.type';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, skip, takeUntil, tap } from 'rxjs/operators';
import { ConnectModalService } from '../connect-modal/services/connect-modal.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent extends BaseSubscriberComponent implements OnInit {
  @Output() openSide = new EventEmitter<boolean>();

  public currentAddress: string;
  public isSmallScreen: boolean = false;
  public isWrongNetwork = false;

  public get isAuth(): boolean {
    return this.authStore.isLoggedInUser;
  }

  constructor(
    private connectModalService: ConnectModalService,
    private authStore: AuthStore,
    private cdr: ChangeDetectorRef,
    private breakpointObserver: BreakpointObserver
  ) {
    super();

    this.authStore.network$
      .pipe(
        skip(1),
        debounceTime(300),
        takeUntil(this.notifier)
      )
      .subscribe((network: BlockChainNetwork) => {
        this.isWrongNetwork = !network || network !== BLOCKCHAIN_WORKSPACES.BINANCE;
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      });
  }

  ngOnInit() {
    this.isSmallScreen = this.breakpointObserver.isMatched('(max-width: 600px)');
    this.authStore.accountChanged.pipe(
      takeUntil(this.notifier),
      tap(async (account) => {
        // if (account[0]) {
          this.currentAddress = account[0];
          this.cdr.detectChanges();
        // }
      })
    ).subscribe();
  }

  public connectWallet(): void {
    this.connectModalService.open()
      .pipe(takeUntil(this.notifier))
      .subscribe((res) => {
        if (res && this.account) {
          this.authStore.accountChanged.next([this.account]);
          this.cdr.detectChanges();
        }
      });
  }

  public open() {
    this.openSide.emit(true);
  }

  public get isEth(): boolean {
    return this.authStore.ethEnabled;
  }

  public get account(): string {
    return this.authStore.userAccount;
  }

}
