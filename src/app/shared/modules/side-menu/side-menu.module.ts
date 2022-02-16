import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideMenuComponent } from './side-menu.component';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { IconModule } from '@core/icon/icon.module';



@NgModule({
  declarations: [
    SideMenuComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    IconModule
  ],
  exports: [
    SideMenuComponent
  ]
})
export class SideMenuModule { }
