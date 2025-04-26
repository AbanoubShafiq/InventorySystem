import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable,Subject } from 'rxjs';
import { Order } from '../_models/order.module';
import { Product } from '../_models/product.model';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:5000/order';
    private productApiUrl = 'http://localhost:5000/product';
  private orderUpdated = new Subject<Order>();

  constructor(private http: HttpClient,
    private cookieSer: CookieService
  ) {} // Update with your actual backend API URL

  createOrder(order: Order): Observable<any> {
    const token = this.cookieSer.get('token');
    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.post(`${this.apiUrl}/createOrder`, order, { headers });
  }

  getAllOrders(): Observable<Order[]> {
    const token = this.cookieSer.get('token');
    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.get<Order[]>(`${this.apiUrl}/getAllOrders`, { headers });
  }

  getOrderById(id: string): Observable<Order> {
    const token = this.cookieSer.get('token');
    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.get<Order>(`${this.apiUrl}/getOrderById/${id}`, { headers });
  }

  getOrdersByCustomerAndStatus(id: string, status: string): Observable<Order[]> {
    const token = this.cookieSer.get('token');
    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.get<Order[]>(`${this.apiUrl}/getOrderByCustomerAndStatus/${id}/${status}`, { headers });
  }

  getOrdersByCustomerId(id: string): Observable<Order[]> {
    const token = this.cookieSer.get('token');
    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.get<Order[]>(`${this.apiUrl}/getOrderByCustomerId/${id}`, { headers });
  }


  getOrdersByStatus(status: string): Observable<Order[]> {
    const token = this.cookieSer.get('token');
    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.get<Order[]>(`${this.apiUrl}/getOrdersByStatus/${status}`, { headers });
  }

  getOrdersByProductId(id: string): Observable<Order[]> {
    const token = this.cookieSer.get('token');
    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.get<Order[]>(`${this.apiUrl}/getOrdersByProductId/${id}`, { headers });
  }

  changeOrderStatus(id: string, status: string): Observable<any> {
    const token = this.cookieSer.get('token');
    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.put(`${this.apiUrl}/changeOrderStatus/${id}/${status}`, {}, { headers });
  }

  deleteOrder(id: string): Observable<any> {
    const token = this.cookieSer.get('token');
    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.delete(`${this.apiUrl}/deleteOrder/${id}`, { headers });
  }

  updateOrder(id: string, order: Partial<Order>): Observable<any> {
    const token = this.cookieSer.get('token');
    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.put(`${this.apiUrl}/updateOrder/${id}`, order, { headers });
  }

  getProductById(productId: string): Observable<Product> {
    const token = this.cookieSer.get('token');
    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.get<Product>(`${this.apiUrl}/getProductById/${productId}`, { headers });
  }

  deleteProductFromOrder(orderId: string, productId: string): Observable<any> {
    const token = this.cookieSer.get('token');
    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.delete(`${this.apiUrl}/${orderId}/product/${productId}`, { headers });
  }




}
