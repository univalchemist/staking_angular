import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputAreaComponent } from './input-area.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    InputAreaComponent
  ],
  exports: [
    InputAreaComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ]
})
export class InputAreaModule { }
