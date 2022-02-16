import { TestBed } from '@angular/core/testing';

import { ConnectModalService } from './connect-modal.service';

describe('ConnectModalService', () => {
  let service: ConnectModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConnectModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
