import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthServiceService } from '../_services/auth-service.service';
import { map, Observable } from 'rxjs';

export const canLoginSuperAdminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthServiceService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigateByUrl('/user/login');
    return false;
  }

  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('token='))
    ?.split('=')[1];
    console.log("Token from cookies:", token);

  if (!token) {
    router.navigateByUrl('/user/login');
    return false;
  }

  return authService.decodeToken(token).pipe(
    map(decodedToken => {
      if (decodedToken?.role === 'manager') {
        return true;
      } else {
        router.navigateByUrl('/user/login');
        return false;
      }
    })
  ) as Observable<boolean>;
};

