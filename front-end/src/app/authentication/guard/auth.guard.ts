// import { inject } from '@angular/core';
// import { CanActivateFn, Router } from '@angular/router';
// import { CookieService } from 'ngx-cookie-service';
// import { AuthServiceService } from 'src/app/_services/auth-service.service';

// export const authGuardUserProfile: CanActivateFn = (route, state) => {

//   let router = inject(Router);
//   let authService = inject(AuthServiceService)
//   let cookieService = inject(CookieService)

//   const tokenString = cookieService.get("token");

// if (!tokenString) {
//   return router.parseUrl("/user/login"); // Redirect if no token
// }

// console.log("Token:", tokenString);

// authService.decodeToken(tokenString).subscribe({
//   next: (decodedToken) => {
//     console.log("Decoded Token:", decodedToken);
//     console.log(decodedToken.role.toLowerCase());
//     console.log(decodedToken.role.toLowerCase() == 'customer')
//     if (decodedToken.role.toLowerCase() == 'customer')
//     {
//       return true;
//     }
//     return false
//   },
//   error: (err) => {
//     return false
//   }
// });
// return false;


// };

import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthServiceService } from 'src/app/_services/auth-service.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export const authGuardUserProfile: CanActivateFn = (route, state): Observable<boolean | UrlTree> => {
  const router = inject(Router);
  const authService = inject(AuthServiceService);
  const cookieService = inject(CookieService);

  const tokenString = cookieService.get("token");

  if (!tokenString) {
    return of(router.parseUrl("/user/login")); // Redirect if no token
  }

  console.log("Token:", tokenString);

  return authService.decodeToken(tokenString).pipe(
    map(decodedToken => {
      console.log("Decoded Token:", decodedToken);
      if (decodedToken.role.toLowerCase() === 'customer') {
        return true; // Grant access
      } else {
        return router.parseUrl("/user/login"); // Redirect unauthorized users
      }
    }),
    catchError(err => {
      console.error("Error decoding token:", err);
      return of(router.parseUrl("/user/login")); // Redirect on error
    })
  );
};

