import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { cashierGuard } from './cashier.guard';

describe('cashierGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => cashierGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
