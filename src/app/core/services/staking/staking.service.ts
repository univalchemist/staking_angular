import { Injectable } from '@angular/core';
import { UserInfo } from '@core/services/staking/interfaces/user-info.interface';
import { environment } from '@environment';
import { ContractAddresses, CotractAddressesMainnet, CotractAddressesTestnet } from '@shared/constants';
import { Contract } from 'web3-eth-contract';
import Staking from '../../../../assets/jsons/abi/Staking.json';
import ERC20 from '../../../../assets/jsons/abi/ERC20.json';
import LpStaking from '../../../../assets/jsons/abi/LPStaking.json';
import PremiumStaking from '../../../../assets/jsons/abi/PremiumStaking.json';
import Web3 from 'web3';
import { BLOCKCHAIN_WORKSPACES } from '@shared/enums';
import { UtilsService } from '@shared/services/utils.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { AVERAGE_BLOCK_AMOUNT_PER_YEAR } from '@shared/constants/staking.contstant';

declare let window: any;

@Injectable({
  providedIn: 'root'
})
export class StakingService {

  public laceAllowance = new BehaviorSubject<number>(null);
  public lpAllowance = new BehaviorSubject<number>(null);

  constructor(
    private utilsService: UtilsService
  ) {
  }

  static getContractAddresses() {
    return environment.isMainnet ? CotractAddressesMainnet : CotractAddressesTestnet;
  }

  public get web3(): Web3 & any {
    window['web3'] = new Web3(window[BLOCKCHAIN_WORKSPACES.ETHEREUM]);

    return window['web3'];
  }

  public getLaceContract(): Contract {
    if (window.web3.eth) {
      return new window.web3.eth.Contract(ERC20, ContractAddresses.laceToken);
    }

    return null;
  }

  public getStakingContract(): Contract {
    if (window.web3.eth) {
      return new window.web3.eth.Contract(Staking, ContractAddresses.guaranteedApyStaking);
    }

    return null;
  }

  public getLpStakingContract(): Contract {
    if (window.web3.eth) {
      return new window.web3.eth.Contract(LpStaking, ContractAddresses.lpStaking);
    }

    return null;
  }

  public getLpContract(): Contract {
    if (window.web3.eth) {
      return new window.web3.eth.Contract(ERC20, ContractAddresses.lpToken);
    }

    return null;
  }

  public increaseAllowance(address: string, value: string, stakingAddress: string, tokenContract: Contract) {
    return new Promise((resolve) => {
      tokenContract.methods.approve(stakingAddress, value).send({ from: address }, (err, res) => {
        if (err) {
          resolve(false);
        }
      }).then(res => {
        resolve(res);
      });
    });
  }

  public getAllowance(account: string, stakingAddress: string, tokenContract: Contract) {
    return tokenContract.methods.allowance(account, stakingAddress).call({ from: account });
  }

  public stake(account: string, amount: string, stakingContract: Contract) {
    // return stakingContract.methods.stake(amount).send({from: account}, (err, res) => {
    //   if (err) return false;
    // });

    return new Promise((resolve) => {
      stakingContract.methods.stake(amount).send({ from: account }, (err, res) => {
        if (err) {
          resolve(false);
        }
      }).then(res => {
        resolve(res);
      });
    });
  }

  public getCooldownPeriod(contract: Contract, account: string): Observable<number> {
      return new Observable<number>(observer => {
        contract.methods.cooldownPeriod()
          .call({ from: account })
          .then((res: string) => {
            observer.next((+res) * 1000);
            observer.complete();
          })
          .catch(error => observer.error(error));
      });
  }

  public getUsersInfo(contract: Contract, account: string): Observable<UserInfo> {
      return new Observable<UserInfo>(observer => {
        contract.methods.usersInfo(account)
          .call({ from: account })
          .then((res: UserInfo) => {
            observer.next(res);
            observer.complete();
          })
          .catch(error => observer.error(error));
      });
  }

  public unstake(account: string, amount: string, stakingContract: Contract) {
    return new Promise((resolve) => {
      stakingContract.methods.withdraw(amount).send({ from: account }, (err, res) => {
        if (err) {
          resolve(false);
        }
      }).then(res => {
        resolve(res);
      });
    });
    // return stakingContract.methods.withdraw(amount).send({from: account});
  }

  public collect(contract: Contract, account: string) {
    return new Promise((resolve) => {
      contract.methods.getReward().send({ from: account }, (err, res) => {
        if (err) {
          resolve(false);
        }
      }).then(res => {
        resolve(res);
      });
    });
    // contract.methods.getReward().send({from: account});
  }

  public async getDefaultData(stakingContract: Contract, tokenContract: Contract, accountAddress: string, isLimited = false) {
    let earned = '';
    let staked = '';
    // const rewards = this.utilsService.convertFrom(await stakingContract.methods.rewards(accountAddress).call());
    let totalStaked = '';
    let canWithdraw = true;
    let canStake = true;
    let stakeStartDate = null;
    let stakeEndDate = null;
    let stakingCap = null;
    const balance = this.utilsService.convertFrom(await tokenContract.methods.balanceOf(accountAddress).call());

    if (isLimited) {
      staked = this.utilsService.convertFrom(await stakingContract.methods.stakeOf(accountAddress).call());
      earned = this.utilsService.convertFrom(await stakingContract.methods.earned(accountAddress).call());
      totalStaked = this.utilsService.convertFrom(await stakingContract.methods.stakedTotal().call());
      let withdrawEndDate = await stakingContract.methods.withdrawEnds().call();
      let withdrawStartDate = await stakingContract.methods.withdrawStarts().call();
      canWithdraw = this.utilsService.isDatePass(withdrawStartDate) && !this.utilsService.isDatePass(withdrawEndDate);
      stakeEndDate = await stakingContract.methods.stakingEnds().call();
      stakeStartDate = await stakingContract.methods.stakingStarts().call();
      stakingCap = await stakingContract.methods.stakingCap().call();
      canStake = this.utilsService.isDatePass(stakeStartDate) && !this.utilsService.isDatePass(stakeEndDate);
    } else {
      let userinfo = await stakingContract.methods.usersInfo(accountAddress).call();
      console.log(userinfo);
      staked = this.utilsService.convertFrom(userinfo.staked);
      earned = this.utilsService.convertFrom(await stakingContract.methods.earned(accountAddress).call());
      totalStaked = this.utilsService.convertFrom(await stakingContract.methods.totalStaked().call());
    }

    return {
      earned,
      staked,
      balance,
      totalStaked,
      canWithdraw,
      canStake,
      ...(
        isLimited
          ? {
            stakeStartDate: stakeStartDate * 1000, // convert seconds to miliseconds
            stakeEndDate: stakeEndDate * 1000, // convert seconds to miliseconds
            stakingCap: this.utilsService.convertFrom(stakingCap)
          }
          : {}
      )
    };
  }

  public getContractByAddress(address: string): Contract {
    let contract = null;
    switch (address) {
      case ContractAddresses.guaranteedApyStaking: {
        contract = new window.web3.eth.Contract(PremiumStaking, address);
        break;
      }
      case ContractAddresses.unlimitedStaking: {
        contract = new window.web3.eth.Contract(Staking, address);
        break;
      }
      case ContractAddresses.laceToken: {
        contract = new window.web3.eth.Contract(ERC20, address);
        break;
      }
      case ContractAddresses.lpToken: {
        contract = new window.web3.eth.Contract(ERC20, address);
        break;
      }
      case ContractAddresses.lpStaking: {
        contract = new window.web3.eth.Contract(LpStaking, address);
        break;
      }
    }
    return contract;
  }

  async getLaceApy(contract: Contract, account: string): Promise<string> {

    const rewardPerBlockResult = await contract.methods.rewardPerBlock().call();

    const staked = this.utilsService.convertFrom(await contract.methods.totalStaked().call());

    const rewardPerBlock = this.utilsService.toBN(this.utilsService.convertFrom(rewardPerBlockResult));

    let apy = rewardPerBlock.times(AVERAGE_BLOCK_AMOUNT_PER_YEAR).times(100).div(this.utilsService.toBN(this.utilsService.convertFrom(staked)));

    return apy.shiftedBy(-18).dp(2).toString();
  }

  async getLimitedApy(contract: Contract, account: string) {
    const secondsInYear = this.utilsService.toBN(60 * 60 * 24 * 30 * 12);
    const totalReward = this.utilsService.toBN(await contract.methods.totalReward().call());
    const stakingCap = this.utilsService.toBN(await contract.methods.stakingCap().call());
    const stakingStarts = this.utilsService.toBN(await contract.methods.stakingStarts().call());
    const stakingEnds = this.utilsService.toBN(await contract.methods.stakingEnds().call());

    const diff = stakingEnds.minus(stakingStarts);

    const apy =
      totalReward
        .times(100)
        .times((
          secondsInYear
            .div(diff)
        ))
        .div(stakingCap);

    return apy.dp(2).toString();
  }

  async getLimitedPoolReward(contract: Contract, account: string) {
    const currentDate = this.utilsService.toBN(Date.now() / 1000).dp(0);
    const stakedOf = this.utilsService.toBN(await contract.methods.stakeOf(account).call());
    const stakingStarts = this.utilsService.toBN(await contract.methods.stakingStarts().call());
    const stakingEnds = this.utilsService.toBN(await contract.methods.stakingEnds().call());
    const totalReward = this.utilsService.toBN(await contract.methods.totalReward().call());
    const stakingCap = this.utilsService.toBN(await contract.methods.stakingCap().call());

    const reward =
      stakedOf
        .times((
          currentDate
            .minus(stakingStarts)
        ))
        .times(totalReward)
        .div(stakingCap)
        .div((
          stakingEnds
            .minus(stakingStarts)
        ));

    return reward.shiftedBy(-18).dp(3).toString();
  }

  async getApy(contract: Contract) {
    const apy = this.utilsService.toBN(await contract.methods.getAPY().call()).shiftedBy(-5).dp(2).toString();

    return apy;
  }
}
