import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';
import { AnalyticsData } from '../analytics/models/analytics.model';
import { Order } from '../models/order.model';
import { AuthServiceService } from '../../_services/auth-service.service';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:5000/order'; // Add /order to base URL

  constructor(
    private http: HttpClient,
    private authService: AuthServiceService,
    private cookieService: CookieService
  ) {}

  getAllOrders(): Observable<Order[]> {
    // Use correct endpoint with /order prefix
    return this.http.get<Order[]>(`${this.apiUrl}/getAllOrders`)
      .pipe(catchError(this.handleError));
  }

  changeOrderStatus(orderId: string, status: string): Observable<Order> {
    // Use correct endpoint with /order prefix
    return this.http.put<Order>(`${this.apiUrl}/changeOrderStatus/${orderId}/${status}`, {})
      .pipe(catchError(this.handleError));
  }

  getSalesAnalytics(startDate: string, endDate: string): Observable<AnalyticsData> {
    const token = this.cookieService.get('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    return this.authService.decodeToken(token).pipe(
      switchMap(decodedToken => {
        if (!decodedToken) {
          throw new Error('Invalid token');
        }
        
        const params = new HttpParams()
          .set('startDate', startDate)
          .set('endDate', endDate)
          .set('sellerId', decodedToken.sub);
        
        return this.http.get<AnalyticsData>(`${this.apiUrl}/getSalesAnalytics`, { params });
      }),
      catchError(this.handleError)
    );
  }

  getSellerOrders(): Observable<Order[]> {
    const token = this.cookieService.get('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    return this.authService.decodeToken(token).pipe(
      switchMap(decodedToken => {
        if (!decodedToken) {
          throw new Error('Invalid token');
        }
        // Use correct endpoint with /order prefix
        return this.http.get<Order[]>(`${this.apiUrl}/getAllOrders`).pipe(
          map(orders => this.filterOrdersBySeller(orders, decodedToken.sub)),
          catchError(error => {
            console.error('Error fetching orders:', error);
            return throwError(() => error);
          })
        );
      })
    );
  }

  getOrdersByStatus(status: string): Observable<Order[]> {
    // Use correct endpoint with /order prefix
    return this.http.get<Order[]>(`${this.apiUrl}/getOrdersByStatus/${status}`)
      .pipe(catchError(this.handleError));
  }

  getOrderById(orderId: string): Observable<Order> {
    // Use correct endpoint with /order prefix
    return this.http.get<Order>(`${this.apiUrl}/getOrderById/${orderId}`)
      .pipe(catchError(this.handleError));
  }

  public filterOrdersBySeller(orders: Order[], sellerId: string): Order[] {
    return orders.filter(order => 
      order.items.some(item => item.product?.sellerId === sellerId)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    return throwError(() => error.error?.message || 'Server error');
  }
}