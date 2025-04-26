import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthServiceService } from 'src/app/_services/auth-service.service';

export const loginGuardGuard: CanActivateFn = (route, state) => {
  

    let authSer = inject(AuthServiceService)
  
  return !(authSer.isAuthenticated());

};
