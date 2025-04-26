// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class CartService {
//   private apiUrl = 'http://localhost:5000/api/cart';

//   constructor(private http: HttpClient) {}

//   getCart(userId: string): Observable<any> {
//     return this.http.get(`${this.apiUrl}/${userId}`);
//   }

//   addToCart(userId: string, subInventoryId: string, quantity: number): Observable<any> {
//     return this.http.post(`${this.apiUrl}/add`, { userId, subInventoryId, quantity });
//   }

//   removeFromCart(userId: string, subInventoryId: string): Observable<any> {
//     return this.http.delete(`${this.apiUrl}/remove/${userId}/subInventory/${subInventoryId}`);
//   }

//   increaseQuantity(userId: string, subInventoryId: string): Observable<any> {
//     return this.http.put(`${this.apiUrl}/inc/${userId}/subInventory/${subInventoryId}`, {});
//   }

//   decreaseQuantity(userId: string, subInventoryId: string): Observable<any> {
//     return this.http.put(`${this.apiUrl}/dec/${userId}/subInventory/${subInventoryId}`, {});
//   }

//   clearCart(userId: string): Observable<any> {
//     return this.http.delete(`${this.apiUrl}/${userId}/delete`);
//   }

//   getProductDetails(userId: string, subInventoryId: string): Observable<any> {
//     return this.http.get(`${this.apiUrl}/${userId}/subInventory-details/${subInventoryId}`);
//   }

  
// }
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service'; 

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:5000/api/cart';

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

  getCart(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${userId}`, { headers: this.getHeaders() });
  }

  addToCart(userId: string, subInventoryId: string, quantity: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, { userId, subInventoryId, quantity }, { headers: this.getHeaders() });
  }

  removeFromCart(userId: string, subInventoryId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/remove/${userId}/subInventory/${subInventoryId}`, { headers: this.getHeaders() });
  }

  increaseQuantity(userId: string, subInventoryId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/inc/${userId}/subInventory/${subInventoryId}`, {}, { headers: this.getHeaders() });
  }

  decreaseQuantity(userId: string, subInventoryId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/dec/${userId}/subInventory/${subInventoryId}`, {}, { headers: this.getHeaders() });
  }

  clearCart(userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${userId}/delete`, { headers: this.getHeaders() });
  }

  getProductDetails(userId: string, subInventoryId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${userId}/subInventory-details/${subInventoryId}`, { headers: this.getHeaders() });
  }
}
