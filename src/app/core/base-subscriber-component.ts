import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export abstract class BaseSubscriberComponent implements OnDestroy {
  notifier = new Subject();

  // dont forget to call super.ngOnDestroy() if you want to use inside your component ngOnDestroy()
  ngOnDestroy(): void {
    this.notifier.next();
    this.notifier.complete();
  }
}
