import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { HeaderComponent } from './header.component';
import { NetworkSwitchModule } from '../network-switch/network-switch.module';


@NgModule({
  declarations: [
    HeaderComponent
  ],
  imports: [
    CommonModule,
    NetworkSwitchModule,
    RouterModule,
    
  ],
  exports: [
    HeaderComponent
  ]
})
export class HeaderModule { }
