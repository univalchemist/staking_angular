import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, mapTo, takeUntil, tap } from 'rxjs/operators';

// import { SecretType } from '@arkane-network/arkane-connect';

import { ADD_MATIC_MAINNET_PARAMS } from '@shared/constants/app.constants';
import { AuthStore } from '@shared/services/stores';
import { BLOCKCHAIN_WORKSPACES, NETWORKS_CHAINS } from '@shared/enums';
import { BaseSubscriberComponent } from '@core/base-subscriber-component';
import { ChainConfigInterface, ChainSelectOption } from '@shared/interfaces';
import { ChainsConfig } from '@shared/constants';
import { ConnectModalService } from '@shared/modules/connect-modal/services/connect-modal.service';
import { MatMenuTrigger } from '@angular/material/menu';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
// import { EthereumNoticeDialogService } from '@shared/modules/ethereum-notice-dialog/services/ethereum-notice-dialog.service';


@Component({
  selector: 'app-network-switch',
  templateUrl: './network-switch.component.html',
  styleUrls: ['./network-switch.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NetworkSwitchComponent extends BaseSubscriberComponent implements OnInit {
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;

  public networks: ChainConfigInterface = ChainsConfig;
  public currentNetwork: ChainSelectOption;
  public isOpenedMenu = false;
  public currentAddress: string;
  public isSmallScreen: boolean = false;

  public get networkList(): ChainSelectOption[] {
    return Object.values(this.networks).filter((item: ChainSelectOption) => item.type !== this.currentNetwork.type);
  }

  constructor(
    private cdr: ChangeDetectorRef,
    private connectModalService: ConnectModalService,
    private authStore: AuthStore,
    private breakpointObserver: BreakpointObserver
    // private ethereumNoticeDialogService: EthereumNoticeDialogService
  ) {
    super();
  }

  ngOnInit(): void {

    this.isSmallScreen = this.breakpointObserver.isMatched('(max-width: 600px)');

    this.authStore.accountChanged.pipe(
      takeUntil(this.notifier),
      tap(async (account) => {
        if (account[0]) {
          this.currentAddress = account[0];
          this.cdr.detectChanges();
        }
      })
    ).subscribe();


    this.authStore.chainId
      .pipe(
        filter((chainId: number) => !!chainId),
        tap((chainId: number) => {
          switch (chainId) {
            case NETWORKS_CHAINS.ETHER_CHAIN_ID:
              this.currentNetwork = this.networks[BLOCKCHAIN_WORKSPACES.ETHEREUM];
              break;
            case NETWORKS_CHAINS.ETHER_TEST_CHAIN_ID:
              this.currentNetwork = this.networks[BLOCKCHAIN_WORKSPACES.ETHEREUM];
              break;
            case NETWORKS_CHAINS.MATIC_CHAIN_ID:
              this.currentNetwork = this.networks[BLOCKCHAIN_WORKSPACES.MATIC];
              break;
            case NETWORKS_CHAINS.MATIC_TEST_CHAIN_ID:
              this.currentNetwork = this.networks[BLOCKCHAIN_WORKSPACES.MATIC];
              break;
            case NETWORKS_CHAINS.BSC_CHAIN_ID:
              this.currentNetwork = this.networks[BLOCKCHAIN_WORKSPACES.BINANCE];
              break;
            case NETWORKS_CHAINS.BSC_TEST_CHAIN_ID:
              this.currentNetwork = this.networks[BLOCKCHAIN_WORKSPACES.BINANCE];
              break;
            default:
              this.currentNetwork = null;
          }

          this.cdr.detectChanges();
        }),
        takeUntil(this.notifier)
      ).subscribe();
  }

  public selectNetwork(network: ChainSelectOption): void {
    debugger
    if (!network?.type) {
      return;
    }

    let switchChain$: Observable<null>;

    // switch (network.type) {
    //   case BLOCKCHAIN_WORKSPACES.ETHEREUM:
    //     if (this.authStore.arkaneWallet) {
    //       this.authStore.switchArkaneWallet(SecretType.ETHEREUM);
    //       break;
    //     }
    //     this.ethereumNoticeDialogService.openUpdateNetworkDialog();
    //     break;
    //   case BLOCKCHAIN_WORKSPACES.MATIC:
    //     if (this.authStore.arkaneWallet) {
    //       this.authStore.switchArkaneWallet(SecretType.MATIC);
    //       break;
    //     }
    //     switchChain$ = this.authStore.switchChain(ADD_MATIC_MAINNET_PARAMS, false);
    //     break;
    // }

    if (switchChain$) {
      switchChain$
        .pipe(
          mapTo(true),
          takeUntil(this.notifier)
        )
        .subscribe();
    }
  }

  public get account(): string {
    return this.authStore.userAccount;
  }

  public switchNetwork(): void {
    this.connectModalService.open()
      .pipe(takeUntil(this.notifier))
      .subscribe();
  }

  public menuOpened(): void {
    this.isOpenedMenu = true;
  }

  public menuClosed(): void {
    this.trigger.closeMenu();
    this.isOpenedMenu = false;
    this.cdr.detectChanges();
  }

  public disconnect(): void {
    this.authStore.logout();
  }
}
