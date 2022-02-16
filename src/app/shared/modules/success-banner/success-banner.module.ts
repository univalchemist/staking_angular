import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuccessBannerComponent } from './success-banner.component';
import { MatIconModule } from '@angular/material/icon';
import { IconModule } from '@core/icon/icon.module';



@NgModule({
  declarations: [
    SuccessBannerComponent
  ],
  exports: [
    SuccessBannerComponent
  ],
  imports: [
    CommonModule,
    IconModule,
    MatIconModule
  ]
})
export class SuccessBannerModule { }
