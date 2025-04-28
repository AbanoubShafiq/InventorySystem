import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode } from 'jwt-decode';
@Injectable({
  providedIn: 'root'
})
export class CartCheckoutGuard implements CanActivate {
  constructor(private cookieService: CookieService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = this.cookieService.get('token'); 

    if (!token) {
      this.router.navigate(['/user/login']); 
      return false;
    }

    try {
      const decodedToken: any = jwtDecode(token); 
      const userRole = decodedToken.role;
      const userId = decodedToken.sub; 
      const branchId = decodedToken.branchId; 

      console.log('User Role:', userRole);
      console.log('User ID:', userId);
      console.log('Branch ID:', branchId);

      localStorage.setItem('userId', userId); 

      if (userRole === 'customer') {
        return true;
      }

      if (userRole === 'cashier') {
        if (state.url.includes('/cashier') || state.url.includes('/cartCashier')) {
          return true; 
        }
      }

      this.router.navigate(['/unauthorized']); 
      return false;
    } catch (error) {
      console.error('Invalid Token:', error);
      this.router.navigate(['/user/login']); 
      return false;
    }
  }
}
