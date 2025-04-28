
import { OfflineOrder } from '../_models/offlineOrder.model';
import { Branch } from '../_models/branch.model';
import { SubInventory } from '../_models/sub-inventory.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service'; 

@Injectable({
  providedIn: 'root'
})


export class OfflineOrderService {
  private apiUrl = 'http://localhost:5000/offlineOrder';

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  private getAuthToken(): string {
    return this.cookieService.get('token'); 
  }

  private getHeaders() {
    const token = this.getAuthToken();
    console.log('Token in Headers:', token); 
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }
  
  createOfflineOrder(order: OfflineOrder): Observable<any> {
    return this.http.post(`${this.apiUrl}/createOfflineOrder`, order, { headers: this.getHeaders() });
  }

  getAllOfflineOrders(): Observable<OfflineOrder[]> {
    return this.http.get<OfflineOrder[]>(`${this.apiUrl}/getAllOfflineOrders`, { headers: this.getHeaders() });
  }

  getOfflineOrderById(id: string): Observable<OfflineOrder> {
    return this.http.get<OfflineOrder>(`${this.apiUrl}/getOfflineOrderbyId/${id}`, { headers: this.getHeaders() });
  }

  getOfflineOrdersByBranchId(branchId: string): Observable<OfflineOrder[]> {
    return this.http.get<OfflineOrder[]>(`${this.apiUrl}/getOfflineOrdersByBranchId/${branchId}`, { headers: this.getHeaders() });
  }

  cancelOfflineOrder(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/cancelOfflineOrder/${id}`, {}, { headers: this.getHeaders() });
  }

  getBranchById(id: string): Observable<Branch> {
    return this.http.get<Branch>(`${this.apiUrl}/branch/getBranchById/${id}`, { headers: this.getHeaders() });
  }

  getSubInventoryById(id: string): Observable<SubInventory> {
    return this.http.get<SubInventory>(`${this.apiUrl}/subInventory/getSubInventoryById/${id}`, { headers: this.getHeaders() });
  }
  deleteProductFromOrder(orderId: string, productId: string, quantity: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/deleteProductFromOrder`, { orderId, productId, quantity }, { headers: this.getHeaders() });
  }
}