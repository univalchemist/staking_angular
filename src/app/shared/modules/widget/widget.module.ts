import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateValPipe } from '@core/pipes/date-val/index';
import { WidgetComponent } from './widget.component';
import { InputAreaModule } from '../input-area/input-area.module';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { SuccessBannerModule } from '../success-banner/success-banner.module';
import { IconModule } from '@core/icon/icon.module';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [
    WidgetComponent,
    DateValPipe
  ],
  exports: [
    WidgetComponent
  ],
  imports: [
    CommonModule,
    InputAreaModule,
    MatProgressSpinnerModule,
    SuccessBannerModule,
    IconModule,
    MatIconModule
  ]
})
export class WidgetModule { }
