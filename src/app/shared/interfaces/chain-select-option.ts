import { BlockChainNetwork } from '@shared/types/blockchain-network.type';

export interface ChainSelectOption {
  fullName: string;
  name: string;
  icon: string;
  type: BlockChainNetwork;
}
