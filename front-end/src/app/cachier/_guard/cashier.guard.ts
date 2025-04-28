import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class CashierGuard implements CanActivate {
  constructor(private cookieService: CookieService, private router: Router) {}

  canActivate(): boolean {
    const token = this.cookieService.get('token');

    if (!token) {
      this.router.navigate(['/login']); 
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


      if (userRole === 'cashier') {
        return true; 
      }

      this.router.navigate(['/unauthorized']); 
      return false;
    } catch (error) {
      console.error('Invalid Token:', error);
      this.router.navigate(['/login']);
      return false;
    }
  }
}
