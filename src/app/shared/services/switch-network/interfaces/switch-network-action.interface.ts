import { ChainSelectOption } from '@shared/interfaces';
import { SWITCH_NETWORK_ACTION_TYPES } from '@shared/services/switch-network';

export interface SwitchNetworkAction {
  type: SWITCH_NETWORK_ACTION_TYPES.SWITCH_NETWORK;
  network?: ChainSelectOption | null;
}
