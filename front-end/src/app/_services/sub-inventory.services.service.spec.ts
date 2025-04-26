import { TestBed } from '@angular/core/testing';

import { SubInventoryServicesService } from './sub-inventory.services.service';

describe('SubInventoryServicesService', () => {
  let service: SubInventoryServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubInventoryServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
