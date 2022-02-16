import { TestBed } from '@angular/core/testing';

import { SwitchNetworkService } from './switch-network.service';

describe('SwitchNetworkService', () => {
  let service: SwitchNetworkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SwitchNetworkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
