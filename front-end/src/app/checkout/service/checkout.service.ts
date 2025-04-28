// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class CheckoutService {
//   private apiUrl = 'http://localhost:5000/api/order';

//   constructor(private http: HttpClient) {}

//   createOrder(orderData: any): Observable<any> {
//     return this.http.post(`${this.apiUrl}/createOrder`, orderData);
//   }
// }

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service'; 

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private apiUrl = 'http://localhost:5000/api/order';

  constructor(private http: HttpClient, private cookieService: CookieService) {}


  private getAuthToken(): string {
    return this.cookieService.get('token'); 
  }

  private getHeaders() {
    const token = this.getAuthToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}` 
    });
  }

  createOrder(orderData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/createOrder`, orderData, { headers: this.getHeaders() });
  }
}
