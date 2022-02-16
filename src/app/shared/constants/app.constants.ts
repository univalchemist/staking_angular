import { AddEthereumChainParameter } from '@shared/interfaces/add-ethereum-chain-parameter.interface';

export const ARKANE_CLIENT_ID = 'Bondly';

export const ADD_MATIC_MAINNET_PARAMS: AddEthereumChainParameter = {
  chainId: '0x89',
  chainName: 'Matic Mainnet',
  rpcUrls: ['https://rpc-mainnet.maticvigil.com/'],
  nativeCurrency: {
    name: 'matic',
    symbol: 'MATIC',
    decimals: 18
  },
  blockExplorerUrls: ['https://polygonscan.com/']
};
