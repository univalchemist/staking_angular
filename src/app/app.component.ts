import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BaseSubscriberComponent } from '@core/base-subscriber-component';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends BaseSubscriberComponent implements OnInit {
  public isOpened = false;
  title = 'lovelace-staking';
  isShowTokenInfo = false;

  constructor(private router: Router) {
    super();
  }

  ngOnInit() {
    this.router.events
      .pipe(
        filter((event: any) => event instanceof NavigationEnd),
        takeUntil(this.notifier)
      )
      .subscribe((e: NavigationEnd) => this.isShowTokenInfo = e.url.includes('/lace'));
  }

  public getOpenState(state: boolean) {
    console.log(state);
    this.isOpened = state;
  }
}
