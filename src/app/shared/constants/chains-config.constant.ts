import { BLOCKCHAIN_NETWORK_ICONS, BLOCKCHAIN_WORKSPACES } from '@shared/enums';
import { ChainConfigInterface } from '@shared/interfaces';

export const ChainsConfig: ChainConfigInterface = {
  // TODO Will need in the future
  // [BLOCKCHAIN_WORKSPACES.ETHEREUM]: {
  //   fullName: BLOCKCHAIN_WORKSPACES.ETHEREUM,
  //   name: BLOCKCHAIN_WORKSPACES.ETHEREUM,
  //   icon: BLOCKCHAIN_NETWORK_ICONS.ETHEREUM,
  //   type: BLOCKCHAIN_WORKSPACES.ETHEREUM
  // },
  // [BLOCKCHAIN_WORKSPACES.MATIC]: {
  //   fullName: 'Polygon',
  //   name: 'Polygon',
  //   icon: BLOCKCHAIN_NETWORK_ICONS.POLYGON,
  //   type: BLOCKCHAIN_WORKSPACES.MATIC
  // },
  [BLOCKCHAIN_WORKSPACES.BINANCE]: {
    fullName: 'Binance smart chain',
    name: BLOCKCHAIN_WORKSPACES.BINANCE,
    icon: BLOCKCHAIN_NETWORK_ICONS.BINANCE,
    type: BLOCKCHAIN_WORKSPACES.BINANCE
  }
};
