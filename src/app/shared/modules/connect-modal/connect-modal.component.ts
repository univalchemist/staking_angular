import { Component } from '@angular/core';
import { of } from 'rxjs';
import { catchError, mapTo, switchMap, takeUntil, tap } from 'rxjs/operators';

import { MatDialogRef } from '@angular/material/dialog';

import { BaseSubscriberComponent } from '@core/base-subscriber-component';
import { AuthStore } from '@shared/services/stores/auth-new.store';
import { WalletConnectService } from '@shared/services/wallet-connect.service';


@Component({
  selector: 'app-connect-modal',
  templateUrl: './connect-modal.component.html',
  styleUrls: ['./connect-modal.component.scss']
})
export class ConnectModalComponent extends BaseSubscriberComponent {
  private processing = false;

  constructor(
    private dialogRef: MatDialogRef<ConnectModalComponent>,
    private authSrv: AuthStore,
    private walletConnect: WalletConnectService
  ) {
    super();
  }

  public connect(): void {
    if (this.processing) {
      return;
    }

    this.processing = true;
    console.log("========connect========")

    this.authSrv.login()
      .pipe(
        catchError(() => of(false)),
        tap((connected) => {
          
          if (connected) {
            this.dialogRef.close(true);
          }

          this.processing = false;
        }),
        takeUntil(this.notifier)
      )
      .subscribe();

      this.dialogRef.close();
  }

  public walletconnect() {
    this.walletConnect.createConnector();
  }
}
