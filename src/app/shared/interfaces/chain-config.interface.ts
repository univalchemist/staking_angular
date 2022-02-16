import { BLOCKCHAIN_WORKSPACES } from '@shared/enums';
import { ChainSelectOption } from '@shared/interfaces';

export interface ChainConfigInterface {
  [BLOCKCHAIN_WORKSPACES.ETHEREUM]?: ChainSelectOption;
  [BLOCKCHAIN_WORKSPACES.MATIC]?: ChainSelectOption;
  [BLOCKCHAIN_WORKSPACES.BINANCE]: ChainSelectOption;
}
