import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaceStakingComponent } from './lace-staking.component';

describe('LaceStakingComponent', () => {
  let component: LaceStakingComponent;
  let fixture: ComponentFixture<LaceStakingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LaceStakingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LaceStakingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
