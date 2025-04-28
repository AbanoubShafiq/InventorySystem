import { TestBed } from '@angular/core/testing';

import { DistReqService } from './dist-req.service';

describe('DistReqService', () => {
  let service: DistReqService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DistReqService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
