import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NftStakingComponent } from './nft-staking.component';


const routes: Routes = [
  {
    path: '',
    component: NftStakingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NftStakingRoutingModule {
}
