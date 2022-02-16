import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

import { FooterModule } from '@shared/modules/footer/footer.module';
import { HeaderModule } from '@shared/modules/header/header.module';
import { SideMenuModule } from './shared/modules/side-menu/side-menu.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConnectModalModule } from '@shared/modules/connect-modal/connect-modal.module';
import { IconModule } from '@core/icon/icon.module';
import { TokenInfoModule } from '@shared/modules/token-info/token-info.module';
import { ApiInterceptor } from '@core/interceptors/api-interceptor';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HeaderModule,
    FooterModule,
    BrowserAnimationsModule,
    ConnectModalModule,
    IconModule,
    HttpClientModule,
    TokenInfoModule,
    SideMenuModule,
    CommonModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
