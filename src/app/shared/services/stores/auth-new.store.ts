import { Injectable, NgZone } from "@angular/core";
import { BaseSubscriberComponent } from "@core/base-subscriber-component";
import { ChainsConfig } from '@shared/constants';
import { BLOCKCHAIN_WORKSPACES, LOCAL_STORAGE_KEYS, NETWORKS_CHAINS } from '@shared/enums';
import { ChainSelectOption } from '@shared/interfaces';
import { SWITCH_NETWORK_ACTION_TYPES, SwitchNetworkService } from '@shared/services/switch-network';
import { BlockChainNetwork } from '@shared/types/blockchain-network.type';
import { BehaviorSubject, from, Observable, observable, of, Subject, throwError } from 'rxjs';
import { catchError, debounceTime, filter, switchMap, takeUntil, tap } from 'rxjs/operators';

// import { BLOCKCHAIN_WORKSPACES, BlockchainStatusCodes, LOCAL_STORAGE_KEYS, NETWORKS_CHAINS, WALLET_TYPES } from '@shared/enums';
// import { ADD_MATIC_MAINNET_PARAMS, ARKANE_CLIENT_ID } from '@shared/constants/app.constants';
// import { AddEthereumChainParameter } from '@shared/interfaces/add-ethereum-chain-parameter.interface';

const Web3 = require('web3');

declare let require: any;
declare let window: any;

@Injectable({
    providedIn: 'root'
})
export class AuthStore extends BaseSubscriberComponent {
    public isLoggedInUser: boolean = !!localStorage.getItem(LOCAL_STORAGE_KEYS.LOGGED_IN);
    public accountChanged= new BehaviorSubject<string[]>(['']);
    public chainId = new BehaviorSubject<number>(0);
    public network$ = new BehaviorSubject<BlockChainNetwork>(null);
    public account = '';
    public metamaskEnabled = false;
    public ethEnabled = false;

    private set chainIdValue(value: number) {
      this.chainId.next(value || 0);
      this.network$.next(AuthStore.getNetworkByChainId(value));
    }

    constructor(
        private ngZone: NgZone,
        private switchNetworkService: SwitchNetworkService
    ) {
        super();
        if (window.ethereum) {
            this.ethEnabled = true;
            this.metamaskEnabled = window.ethereum.isMetaMask;
            window.web3 = new Web3(window.ethereum);
            this.web3GetAccounts();
            this.subscribeOnChanges();
        }

        this.network$
          .pipe(
            debounceTime(300),
            filter((selectedNetwork: BlockChainNetwork) =>
              this.isLoggedInUser && selectedNetwork && this.account && selectedNetwork !== BLOCKCHAIN_WORKSPACES.BINANCE),
            switchMap((selectedNetwork: BlockChainNetwork) => this.switchNetworkService.switchNetwork({
              type: SWITCH_NETWORK_ACTION_TYPES.SWITCH_NETWORK,
              network: ChainsConfig[BLOCKCHAIN_WORKSPACES.BINANCE]
            })),
            takeUntil(this.notifier)
          )
          .subscribe((isSwitched: boolean) => {
            if (isSwitched) {
              return;
            }

            this.logout();
          })
    }

  static getNetworkByChainId(chainId: number): BlockChainNetwork  {
    if (chainId === NETWORKS_CHAINS.MATIC_CHAIN_ID || chainId === NETWORKS_CHAINS.MATIC_TEST_CHAIN_ID) {
      return BLOCKCHAIN_WORKSPACES.MATIC;
    }

    if (chainId === NETWORKS_CHAINS.ETHER_CHAIN_ID || chainId === NETWORKS_CHAINS.ETHER_TEST_CHAIN_ID) {
      return BLOCKCHAIN_WORKSPACES.ETHEREUM;
    }

    if (chainId === NETWORKS_CHAINS.BSC_CHAIN_ID || chainId === NETWORKS_CHAINS.BSC_TEST_CHAIN_ID) {
      return BLOCKCHAIN_WORKSPACES.BINANCE;
    }

    return BLOCKCHAIN_WORKSPACES.OTHER;
  }

    public web3GetAccounts(): void {
        window.web3.eth.getAccounts(async (err: any, retAccount: any) => {
          if (retAccount?.[0]) {
            this.accountChanged.next(retAccount);
            this.userAccount = retAccount[0];

            this.getCurrentChain();
          }
        });
    }

    private subscribeOnChanges(): void {
        window.ethereum
          .on('chainChanged', (chainId: string) => this.chainIdValue = parseInt(chainId, 16));

        window.ethereum
          .on('accountsChanged', (accounts: string[]) => this.accountChanged.next(accounts));
    }

    private async getCurrentChain() {
      this.chainIdValue = await window.web3.eth.getChainId();
    }

    private requestAccounts(): Observable<string> {
        return new Observable<string>((observer) => {
            window.web3.currentProvider.sendAsync(
              { method: 'eth_requestAccounts' },
              (error: any, res: any) => {
                if (error) {
                  observer.error(error);
                  return;
                }
                if (res.error) {
                  observer.error(res.error);
                  return;
                }

                if (res?.result?.[0]) {
                  this.userAccount = res.result[0];
                  observer.next(res.result[0]);
                  observer.complete();
                  this.getCurrentChain();
                  return;
                }

                observer.error(res);
              }
            );
          }
        );
    }

    public login(): Observable<string> {
        if (!this.metamaskEnabled) {
        //   this.snackBarService.showSnackBar(
        //     'The MetaMask extension is not installed! Please, install the extension to log in with Metamask.',
        //     'snack-bar-error',
        //     false
        //   );
          localStorage.removeItem(LOCAL_STORAGE_KEYS.LOGGED_IN);
          this.isLoggedInUser = false;

          return of(null);
        }

        return this.requestAccounts()
          .pipe(
            tap((account: any) => {
              localStorage.setItem(LOCAL_STORAGE_KEYS.LOGGED_IN, 'true');
              this.isLoggedInUser = true;
              this.getCurrentChain();
            })
          );
    }

    // private checkMetamaskNetworks(): void {
    //     from(window.web3.eth.getChainId())
    //       .pipe(
    //         switchMap((chainId: number) => {
    //           if (chainId === NETWORKS_CHAINS.MATIC_CHAIN_ID) {
    //             return of(true);
    //           }

    //           this.infoDialogService
    //             .openInfoDialog('We operate on the Matic network to reduce gas fees. Switch to it and you’ll be all set!');

    //           return this.switchChain(ADD_MATIC_MAINNET_PARAMS);
    //         }),
    //         catchError(error => {
    //           return throwError(error);
    //         })
    //       )
    //       .subscribe(result => {
    //         /*if (result === null) {
    //           this.snackBarService
    //             .showSnackBar('Congrats! Your wallet switched to the Matic Mainnet network.', 'server-success', true);
    //             ToDo: Uncomment when Metamask fix error handlers
    //         }*/
    //       });
    // }

    // public switchChain(network: AddEthereumChainParameter, showSnackbar: boolean = true): Observable<null> {
    //     return from(window.web3.currentProvider.request({
    //       method: 'wallet_switchEthereumChain',
    //       params: [{ chainId: network.chainId }]
    //     }))
    //       .pipe(
    //         catchError(error => {
    //           if (error?.code === BlockchainStatusCodes.NO_CHAIN) {
    //             return this.addNetworks(network, showSnackbar);
    //           }

    //           return throwError(error);
    //         }),
    //         mapTo(null)
    //       );
    //   }

      // private addNetworks(network: AddEthereumChainParameter, showSnackbar: boolean = true): Observable<null> {
      //   return from(window.web3.currentProvider.request({
      //       method: 'wallet_addEthereumChain',
      //       params: [network]
      //     }
      //   ))
      //     .pipe(
      //       mapTo(null),
      //       catchError(error => {
      //         if (showSnackbar && error?.code === BlockchainStatusCodes.USER_REJECT && error.message === 'User rejected the request.') {
      //           this.snackBarService
      //             .showSnackBar(`${error.message} :(`, 'snack-bar-error', false);
      //         }

      //         return throwError(error);
      //       })
      //     );
      // }

    public logout(): void {
        this.userAccount = '';
        localStorage.removeItem(LOCAL_STORAGE_KEYS.LOGGED_IN);
        this.isLoggedInUser = false;

        this.ngZone.run(() => {
          // window.web3.eth.currentProvider = null;
          this.accountChanged.next([]);
        });
    }


    public get userAccount(): string {
        return this.account;
    }

    public set userAccount(value: string) {
        this.ngZone.run(() => {
          this.account = value;
        });
    }


}
