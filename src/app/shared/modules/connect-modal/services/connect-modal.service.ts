import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { MatDialog } from '@angular/material/dialog';
import { ConnectModalComponent } from '@shared/modules/connect-modal/connect-modal.component';

@Injectable()
export class ConnectModalService {

  constructor(private dialog: MatDialog) {
  }

  open(): Observable<undefined | null> {
    return this.dialog.open(ConnectModalComponent, {
      width: '320px',
      panelClass: ['app-dialog', 'without-actions'],
    }).afterClosed();
  }
}
