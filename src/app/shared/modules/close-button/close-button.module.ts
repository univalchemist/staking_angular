import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';

import { CloseButtonComponent } from './close-button.component';


@NgModule({
  declarations: [CloseButtonComponent],
  exports: [CloseButtonComponent],
  imports: [
    CommonModule,
    MatIconModule
  ]
})
export class CloseButtonModule {
}
