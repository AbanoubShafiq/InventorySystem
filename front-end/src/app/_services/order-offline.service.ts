import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable ,Subject} from 'rxjs';
import { OrderOffline } from '../_models/orderOffline.model';
import { tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrderOfflineService {
  private apiUrl = 'http://localhost:5000/offlineOrder';
    private orderOfflineUpdated = new Subject<OrderOffline>();
      constructor(private http: HttpClient) { }
    
      getAllOfflineOrders(): Observable<OrderOffline[]> {
        return this.http.get<OrderOffline[]>(`${this.apiUrl}/getAllOfflineOrders`);
      }
      getOfflineOrdersByBranchId(id: string): Observable<OrderOffline[]> {
        return this.http.get<OrderOffline[]>(`${this.apiUrl}/getOfflineOrdersByBranchId/${id}`);
      }
  
      getOfflineOrderbyId(id: string): Observable<OrderOffline> {
        return this.http.get<OrderOffline>(`${this.apiUrl}/getOfflineOrderbyId/${id}`);
      }
    
      cancelOfflineOrder(id: string): Observable<OrderOffline> {
      console.log('Updating user at:', `${this.apiUrl}/cancelOfflineOrder/${id}`);
        return this.http.post<OrderOffline>(`${this.apiUrl}/cancelOfflineOrder/${id}`,{}).pipe(
          tap(updateOrderOffline => {
            console.log('Update successful:', updateOrderOffline);
            this.orderOfflineUpdated.next(updateOrderOffline);
          })
        );
      }

      onOrderOfflineUpdate(): Observable<OrderOffline> {
          return this.orderOfflineUpdated.asObservable();
      }
}
