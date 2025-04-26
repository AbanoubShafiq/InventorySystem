import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/product.model';
import { tap, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  // Remove 'api/category' from the URL since it's already included in the endpoints
  private apiUrl = 'http://localhost:5000';

  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`);
  }

  getActiveCategories(): Observable<Category[]> {
    console.log('Fetching active categories...');
   
    return this.http.get<Category[]>(`${this.apiUrl}/categories/get/active`).pipe(
      tap(categories => {
        console.log('Received categories:', categories);
      }),
      catchError(error => {
        console.error('Error fetching categories:', error);
        return throwError(() => error);
      })
    );
  }

  createCategory(category: Partial<Category>): Observable<Category> {
    return this.http.post<Category>(`${this.apiUrl}/categories`, category);
  }
}
