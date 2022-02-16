import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CloseButtonModule } from '../close-button/close-button.module';
import { DialogHeaderComponent } from './dialog-header.component';

@NgModule({
  declarations: [DialogHeaderComponent],
  exports: [DialogHeaderComponent],
  imports: [
    CommonModule,
    CloseButtonModule
  ]
})
export class DialogHeaderModule {
}
