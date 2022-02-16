import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { takeUntil } from 'rxjs/operators';

import { BaseSubscriberComponent } from '@core/base-subscriber-component';
import { LaceTokenInfo, TokenService } from '@core/services/token';

@Component({
  selector: 'app-token-info',
  templateUrl: './token-info.component.html',
  styleUrls: ['./token-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TokenInfoComponent extends BaseSubscriberComponent {
  tokenInfo: LaceTokenInfo = null;

  constructor(private cdr: ChangeDetectorRef, private tokenService: TokenService) {
    super();

    this.getTokenInfo();
  }

  getTokenInfo(): void {
    this.tokenService.getLaceTokenInfo()
      .pipe(takeUntil(this.notifier))
      .subscribe((res: LaceTokenInfo) => {
        this.tokenInfo = res || null;

        this.cdr.markForCheck();
      });
  }

}
