import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ROUTER_LINKS } from '@shared/enums/router-links.enum';

const routes: Routes = [
  { path: '', redirectTo: `/${ROUTER_LINKS.LACE}`, pathMatch: 'full' },
  {
    path: ROUTER_LINKS.LACE,
    loadChildren: () => import('./pages/lace-staking/lace-staking.module').then(m => m.LaceStakingModule)
  },
  {
    path: ROUTER_LINKS.NFT,
    loadChildren: () => import('./pages/nft-staking/nft-staking.module').then(m => m.NftStakingModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
