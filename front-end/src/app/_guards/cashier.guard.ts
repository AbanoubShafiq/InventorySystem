import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthServiceService } from '../_services/auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class CashierGuard implements CanActivate {
  constructor(private authService: AuthServiceService, private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token');
    
    if (!token) {
      this.router.navigate(['/user/login']);
      return false;
    }
  
    this.authService.decodeToken(token).subscribe(user => {
      if (user && user.role === 'cashier') {
        return true;  
      } else {
        this.router.navigate(['/unauthorized']);
        return false;
      }
    });
  
    return false; // القيمة الافتراضية حتى يتم تنفيذ `subscribe`
  }
  
}
