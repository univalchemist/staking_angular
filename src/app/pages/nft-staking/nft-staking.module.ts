import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NftStakingComponent } from './nft-staking.component';
import { NftStakingRoutingModule } from './nft-staking-routing.module';



@NgModule({
  declarations: [NftStakingComponent],
  imports: [
    CommonModule,
    NftStakingRoutingModule
  ]
})
export class NftStakingModule { }
