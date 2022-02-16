import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BaseSubscriberComponent } from '@core/base-subscriber-component';
import { StakingService } from '@core/services/staking/staking.service';
import { AuthStore } from '@shared/services/stores';
import { UtilsService } from '@shared/services/utils.service';
import { takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent extends BaseSubscriberComponent implements OnInit {

  public tokens: string;

  @Input() public isOpened = true;
  @Output() public close = new EventEmitter();

  constructor(
    private stakingService: StakingService,
    private authStore: AuthStore,
    private utilsService: UtilsService
  ) {
    super();
  }

  async ngOnInit() {
    this.authStore.accountChanged.pipe(
      takeUntil(this.notifier),
      tap(async (account) => {
        if (account[0]) {
          let contract = await this.stakingService.getLaceContract();
          this.tokens = this.utilsService.convertFrom(await contract.methods.balanceOf(account[0]).call());
        }
      })
    ).subscribe();
    
  }

  public getSideState(opened: boolean) {
    this.isOpened = opened;
    console.log(this.isOpened);
  }

}
