import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { OfflineOrder } from '../models/offline-order.model';

@Injectable({
  providedIn: 'root'
})
export class OfflineOrderService {
  private apiUrl = 'http://localhost:5000/offlineOrder';

  constructor(private http: HttpClient) { }

  getAllOrdersByBranch(branchId: string): Observable<OfflineOrder[]> {
    return this.http.get<any>(
      `${this.apiUrl}/getOfflineOrdersByBranchId/${branchId}`
    ).pipe(
      map(response => {
        console.log('API Response:', response); // Debug log
        return Array.isArray(response) ? response : [];
      }),
      map(this.transformOrders.bind(this)), // Use bind to maintain correct 'this' context
      catchError(this.handleError)
    );
  }

  createOrder(order: Partial<OfflineOrder>): Observable<OfflineOrder> {
    return this.http.post<OfflineOrder>(`${this.apiUrl}/createOfflineOrder`, order).pipe(
      map(this.transformOrder),
      catchError(this.handleError)
    );
  }

  cancelOrder(orderId: string): Observable<OfflineOrder> {
    return this.http.patch<OfflineOrder>(
      `${this.apiUrl}/cancelOrder/${orderId}`,
      {}
    ).pipe(
      map(this.transformOrder),
      catchError(this.handleError)
    );
  }

  getOrderById(orderId: string): Observable<OfflineOrder> {
    return this.http.get<OfflineOrder>(`${this.apiUrl}/getOfflineOrderbyId/${orderId}`);
  }

  private transformOrders(orders: any[]): OfflineOrder[] {
    if (!Array.isArray(orders)) {
      orders = [orders];
    }
    return orders.map(order => this.transformOrder(order));
  }

  private transformOrder(order: any): OfflineOrder {
    return {
      _id: order._id,
      items: order.items.map((item: any) => ({
        subInventoryId: {
          _id: item.subInventoryId._id,
          mainInventory: item.subInventoryId.mainInventory,
          product: item.subInventoryId.product,
          branch: item.subInventoryId.branch,
          quantity: item.subInventoryId.quantity,
          numberOfSales: item.subInventoryId.numberOfSales,
          active: item.subInventoryId.active,
          lastUpdated: new Date(item.subInventoryId.lastUpdated)
        },
        price: item.price,
        quantity: item.quantity,
        _id: item._id
      })),
      totalPrice: order.totalPrice,
      branch: {
        _id: order.branch._id,
        branchName: order.branch.branchName,
        location: order.branch.location,  // Changed from branchLocation
        contactNumber: order.branch.contactNumber,
        type: order.branch.type,
        isActive: order.branch.isActive
      },
      status: order.status,
      date: new Date(order.date)  // Changed from orderDate
    };
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      
      if (error.status === 404) {
        errorMessage = 'No orders found for this branch';
      } else if (error.status === 401) {
        errorMessage = 'Unauthorized access';
      }
    }

    console.error('Error details:', {
      status: error.status,
      message: error.message,
      error: error.error
    });

    return throwError(() => errorMessage);
  }
}