import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LaceStakingComponent } from './lace-staking.component';


const routes: Routes = [
  {
    path: '',
    component: LaceStakingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LaceStakingRoutingModule {
}
