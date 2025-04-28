import { TestBed } from '@angular/core/testing';

import { OrderOfflineService } from './order-offline.service';

describe('OrderOfflineService', () => {
  let service: OrderOfflineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderOfflineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
