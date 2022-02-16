import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NftStakingComponent } from './nft-staking.component';

describe('NftStakingComponent', () => {
  let component: NftStakingComponent;
  let fixture: ComponentFixture<NftStakingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NftStakingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NftStakingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
