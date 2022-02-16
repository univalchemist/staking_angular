import { Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { catchError, mapTo, tap } from 'rxjs/operators';

import { AbstractProvider } from 'web3-core';

import { BC_NETWORK_PARAMS, BC_TESTNET_NETWORK_PARAMS } from '@core/constants/blockchain-networks-params.constant';
import { BaseSubscriberComponent } from '@core/base-subscriber-component';
import { environment } from '@environment';
import { BLOCKCHAIN_WORKSPACES, BlockchainStatusCodes, LOCAL_STORAGE_KEYS } from '@shared/enums';
import { AddEthereumChainParameter } from '@shared/interfaces';
import { BlockChainNetwork } from '@shared/types/blockchain-network.type';
import { SWITCH_NETWORK_ACTION_TYPES } from './enums';
import { SwitchNetworkAction } from './interfaces';

@Injectable({
  providedIn: 'root'
})
export class SwitchNetworkService extends BaseSubscriberComponent {

  constructor() {
    super();
  }

  switchNetwork(action: SwitchNetworkAction): Observable<boolean> {
    if (!action || !localStorage.getItem(LOCAL_STORAGE_KEYS.LOGGED_IN)) {
      return of(false);
    }

    if (action.type === SWITCH_NETWORK_ACTION_TYPES.SWITCH_NETWORK) {
      if (!action.network.type) {
        return of(false);
      }

      let switchChain$: Observable<boolean> = of(false);

      switch (action.network.type) {
        case BLOCKCHAIN_WORKSPACES.MATIC:
          switchChain$ = this.switchChain(action.network.type);
          break;
        case BLOCKCHAIN_WORKSPACES.ETHEREUM:
          switchChain$ = this.switchChain(action.network.type);
          break;
        case BLOCKCHAIN_WORKSPACES.BINANCE:
          switchChain$ = this.switchChain(action.network.type);
          break;
      }

      return switchChain$;
    }
  }

  switchChain(expectedNetwork: BlockChainNetwork): Observable<boolean> {
    if (expectedNetwork === BLOCKCHAIN_WORKSPACES.OTHER || !window.web3.currentProvider) {
      return of(false);
    }

    const network: AddEthereumChainParameter = (environment.isMainnet ? BC_NETWORK_PARAMS : BC_TESTNET_NETWORK_PARAMS)[expectedNetwork];

    if (!network) {
      return of(false);
    }

    return from((window.web3.currentProvider as AbstractProvider).request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: network.chainId }]
    }))
      .pipe(
        mapTo(true),
        catchError(error => {
          if (error?.code === BlockchainStatusCodes.NO_CHAIN) {
            return this.addNetwork(network);
          }

          return of(false);
        })
      );
  }

  addNetwork(network: AddEthereumChainParameter): Observable<boolean> {
    return from((window.web3.currentProvider as AbstractProvider).request({
        method: 'wallet_addEthereumChain',
        params: [network]
      }
    ))
      .pipe(
        mapTo(true),
        catchError(error => {
          return of(false);
        })
      );
  }

}
