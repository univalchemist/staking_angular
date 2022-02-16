import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { DialogHeaderModule } from '../dialog-header/dialog-header.module';

import { ConnectModalComponent } from '@shared/modules/connect-modal/connect-modal.component';
import { ConnectModalService } from '@shared/modules/connect-modal/services/connect-modal.service';


@NgModule({
  declarations: [ConnectModalComponent],
  imports: [
    CommonModule,
    MatIconModule,
    MatDialogModule,
    DialogHeaderModule
  ],
  providers: [ConnectModalService]
})
export class ConnectModalModule {
}
