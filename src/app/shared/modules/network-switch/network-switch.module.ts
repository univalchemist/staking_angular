import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

// import { EthereumNoticeDialogModule } from '@shared/modules/ethereum-notice-dialog/ethereum-notice-dialog.module';
import { NetworkSwitchComponent } from './network-switch.component';
import { ShortPipe } from '@core/pipes/short.pipe';

@NgModule({
  declarations: [
    NetworkSwitchComponent,
    ShortPipe
  ],
  exports: [
    NetworkSwitchComponent
  ],
  imports: [
    CommonModule,
    // EthereumNoticeDialogModule,
    MatIconModule,
    MatMenuModule
  ]
})
export class NetworkSwitchModule { }
