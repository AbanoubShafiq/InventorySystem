import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { canLoginSuperAdminGuard } from './can-login-super-admin.guard';

describe('canLoginSuperAdminGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => canLoginSuperAdminGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
