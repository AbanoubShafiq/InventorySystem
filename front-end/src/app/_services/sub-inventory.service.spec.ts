import { TestBed } from '@angular/core/testing';

import { SubInventoryService } from './sub-inventory.service';

describe('SubInventoryService', () => {
  let service: SubInventoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubInventoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
