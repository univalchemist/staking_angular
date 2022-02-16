import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, takeUntil } from 'rxjs/operators';

import { MatDialogRef } from '@angular/material/dialog';

import { BaseSubscriberComponent } from '@core/base-subscriber-component';

@Component({
  selector: 'app-dialog-header',
  templateUrl: './dialog-header.component.html',
  styleUrls: ['./dialog-header.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})

export class DialogHeaderComponent extends BaseSubscriberComponent {
  @Input() title = '';

  constructor(
    private dialogRef: MatDialogRef<void>
  ) {
    super();
  }

  close(): void {
    this.dialogRef.close(null);
  }
}
