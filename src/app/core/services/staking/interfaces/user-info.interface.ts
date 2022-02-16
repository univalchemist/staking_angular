export interface UserInfo {
  staked: string; // staked ballacnce
  locked: string; // locked ballance
  lastUpdate: string; // time of last update
  rewardPerTokenPaid?: string;
  rewards?: string; // earned rewards
}
