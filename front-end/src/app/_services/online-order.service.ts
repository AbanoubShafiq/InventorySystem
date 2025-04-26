import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable,Subject } from 'rxjs';
import { Order } from '../_models/order2.model';
import { Product } from '../_models/product.model';

@Injectable({
  providedIn: 'root'
})
export class OnlineOrderService {
  private apiUrl = 'http://localhost:5000/order';
  private productApiUrl = 'http://localhost:5000/product';
private orderUpdated = new Subject<Order>();

constructor(private http: HttpClient) {} // Update with your actual backend API URL


createOrder(order: Order): Observable<any> {
  return this.http.post(`${this.apiUrl}/createOrder`, order);
}

getAllOrders(): Observable<Order[]> {
  return this.http.get<Order[]>(`${this.apiUrl}/getAllOrders`);
}

getOrderById(id: string): Observable<Order> {
  return this.http.get<Order>(`${this.apiUrl}/getOrderById/${id}`);
}

getOrdersByCustomerAndStatus(id: string, status: string): Observable<Order[]> {
  return this.http.get<Order[]>(`${this.apiUrl}/getOrderByCustomerAndStatus/${id}/${status}`);
}

getOrdersByCustomerId(id: string): Observable<Order[]> {
  return this.http.get<Order[]>(`${this.apiUrl}/getOrderByCustomerId/${id}`);
}

getOrdersByStatus(status: string): Observable<Order[]> {
  return this.http.get<Order[]>(`${this.apiUrl}/getOrdersByStatus/${status}`);
}

getOrdersByProductId(id: string): Observable<Order[]> {
  return this.http.get<Order[]>(`${this.apiUrl}/getOrdersByProductId/${id}`);
}

changeOrderStatus(id: string, status: string): Observable<any> {
  return this.http.put(`${this.apiUrl}/changeOrderStatus/${id}/${status}`, {});
}

deleteOrder(id: string): Observable<any> {
  return this.http.delete(`${this.apiUrl}/deleteOrder/${id}`);
}

updateOrder(id: string, order: Partial<Order>): Observable<any> {
  return this.http.put(`${this.apiUrl}/updateOrder/${id}`, order);
}
getProductById(productId: string): Observable<Product> {
  return this.http.get<Product>(`${this.apiUrl}/getProductById/${productId}`);
}
deleteProductFromOrder(orderId: string, productId: string): Observable<any> {
  return this.http.delete(`${this.apiUrl}/${orderId}/product/${productId}`);
}
      onOrderUpdate(): Observable<Order> {
          return this.orderUpdated.asObservable();
      }
}
