import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LaceStakingComponent } from './lace-staking.component';
import { LaceStakingRoutingModule } from './lace-staking-routing.module';
import { WidgetModule } from '@shared/modules/widget/widget.module';



@NgModule({
  declarations: [
    LaceStakingComponent
  ],
  imports: [
    CommonModule,
    LaceStakingRoutingModule,
    WidgetModule
  ]
})
export class LaceStakingModule { }
