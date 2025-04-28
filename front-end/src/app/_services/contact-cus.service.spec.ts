import { TestBed } from '@angular/core/testing';

import { ContactCusService } from './contact-cus.service';

describe('ContactCusService', () => {
  let service: ContactCusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContactCusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
