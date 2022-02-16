import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer.component';
import { MatIconModule } from '@angular/material/icon';
import { IconModule } from '@core/icon/icon.module';



@NgModule({
  declarations: [
    FooterComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    IconModule
  ],
  exports: [
    FooterComponent
  ]
})
export class FooterModule { }
