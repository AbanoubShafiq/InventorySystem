import { TestBed } from '@angular/core/testing';

import { MainInventoryService } from './main-inventory.service';

describe('MainInventoryService', () => {
  let service: MainInventoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MainInventoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
