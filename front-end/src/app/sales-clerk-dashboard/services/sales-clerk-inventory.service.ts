import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { SalesClerkInventory } from '../models/sales-clerk-inventory.model';

@Injectable({
  providedIn: 'root'
})
export class SalesClerkInventoryService {
  private apiUrl = 'http://localhost:5000/subInventory';

  constructor(private http: HttpClient) {}

  getBranchInventory(branchName: string): Observable<SalesClerkInventory[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getSubInventoriesByBranchName/${branchName}`).pipe(
      map(items => this.transformToSalesClerkInventory(items)),
      catchError(this.handleError)
    );
  }

  getActiveBranchInventory(branchName: string): Observable<SalesClerkInventory[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getActiveSubInventoriesByBranchName/${branchName}`).pipe(
      map(items => this.transformToSalesClerkInventory(items)),
      catchError(this.handleError)
    );
  }

  getDeactiveBranchInventory(branchName: string): Observable<SalesClerkInventory[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getDeactiveSubInventoriesByBranchName/${branchName}`).pipe(
      map(items => this.transformToSalesClerkInventory(items)),
      catchError(this.handleError)
    );
  }

  toggleProductStatus(productId: string, isActive: boolean): Observable<any> {
    const endpoint = isActive ? 
      `${this.apiUrl}/deactiveSubInventory/${productId}` : 
      `${this.apiUrl}/activeSubInventory/${productId}`;
    
    return this.http.post(endpoint, {}).pipe(
      catchError(this.handleError)
    );
  }

  deleteProduct(productId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteSubInventory/${productId}`).pipe(
      catchError(this.handleError)
    );
  }

  private transformToSalesClerkInventory(items: any[]): SalesClerkInventory[] {
    if (!Array.isArray(items)) {
      items = [items];
    }
    
    return items.map(item => ({
      _id: item._id,
      name: item.product?.name || 'Unknown Product',
      inventoryName: item.mainInventory?.name || 'Unknown Inventory',
      stock: item.quantity || 0,
      price: item.product?.price || 0,
      lastRestocked: new Date(item.lastUpdated || new Date()),
      isActive: item.active || false,
      product: {
        name: item.product?.name || '',
        description: item.product?.description || ''
      },
      branch: {
        name: item.branch?.branchName || ''
      }
    }));
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    return throwError(() => error.error?.message || 'Server error');
  }
}