import { ContractAddresses } from './contract-addresses.constant';

export const StakingPools = [
  {
    title: 'Guaranteed APY Staking',
    description: 'Stake LACE token for guaranteed APY',
    img: 'assets/icons/star.svg',
    type: 'lace',
    tokenName: 'LACE',
    stakeText: 'Tokens will be locked until Jan 3, 2022.',
    limit: true,
    tokenAddress: ContractAddresses.laceToken,
    stakingAddress: ContractAddresses.guaranteedApyStaking
  },
  {
    title: 'Unlimited Staking',
    description: 'Stake LACE for variable APY',
    img: 'assets/icons/vip.svg',
    type: 'lace',
    tokenName: 'LACE',
    stakeText: 'Rewards are earned immediately. Tokens can be unstaked at any time but can be claimed 10% per day.',
    limit: false,
    tokenAddress: ContractAddresses.laceToken,
    stakingAddress: ContractAddresses.unlimitedStaking
  },
  {
    title: 'LP Staking',
    description: 'Stake LP Tokens for LACE at High variable APY',
    img: 'assets/icons/lp-stacking.svg',
    type: 'lp',
    tokenName: 'LACE-BNB',
    stakeText: 'Rewards are immediate. Tokens can be unstaked at any time but can be claimed 10% per day',
    limit: false,
    tokenAddress: ContractAddresses.lpToken,
    stakingAddress: ContractAddresses.lpStaking
  }
];

export const AVERAGE_BLOCK_AMOUNT_PER_YEAR = 2365323;
