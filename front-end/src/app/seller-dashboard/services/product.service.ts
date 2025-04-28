import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, throwError, of } from 'rxjs';
import { Product, ProductFormData, ProductSubmitData } from '../models/product.model';
import { tap, catchError, map, switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthServiceService } from '../../_services/auth-service.service';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:5000'; 
  private productUpdated = new Subject<Product>();

  constructor(
    private http: HttpClient,
    private authService: AuthServiceService,
    private cookieService: CookieService
  ) {}

  private getSellerId(): Observable<string> {
    const token = this.cookieService.get('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    return this.authService.decodeToken(token).pipe(
      map(decodedToken => {
        if (!decodedToken) {
          throw new Error('Invalid token');
        }
        return decodedToken.id;
      })
    );
  }

  getSellerIdFromToken(): Observable<string | null> {
    const token = localStorage.getItem('token');
    if (token) {
      return this.authService.decodeToken(token).pipe(
        map(decodedToken => decodedToken ? decodedToken.id : null)
      );
    }
    return of(null);
  }

  // Keep core CRUD operations
  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/product/getAllProducts`);
  }

  getActiveProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/product/getActiveProducts`);
  }

  getDeactivatedProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/product/getDeactivatedProducts`);
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/product/getProductById/${id}`);
  }

  createProduct(product: ProductSubmitData): Observable<any> {
    const token = this.cookieService.get('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');

    return this.authService.decodeToken(token).pipe(
      switchMap(decodedToken => {
        if (!decodedToken) {
          throw new Error('Invalid token');
        }

        const productData = {
          ...product,
          sellerId: decodedToken.sub
        };

        return this.http.post(`${this.apiUrl}/product/createProduct`, productData, { headers }).pipe(
          tap(response => console.log('Create product response:', response)),
          catchError(this.handleError)
        );
      })
    );
  }

  updateProduct(id: string, data: ProductSubmitData): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/product/updateProduct/${id}`, data);
  }

  // Keep only one delete method with error handling
  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/product/deleteProduct/${id}`).pipe(
      tap(() => console.log('Delete successful')),
      catchError(this.handleError)
    );
  }

  activateProduct(id: string): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/product/activeProduct/${id}`, {});
  }

  deactivateProduct(id: string): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/product/deactiveProduct/${id}`, {});
  }

  // Keep other unique methods
  getProductsByCategory(categoryId: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/product/getProductsByCategory/${categoryId}`);
  }

  getSellerProducts(sellerId: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/product/seller/${sellerId}`).pipe(
      tap(products => console.log('Raw product response:', JSON.stringify(products, null, 2))),
      catchError(this.handleError)
    );
  }

  getProductsBySeller(sellerId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/seller/${sellerId}`);
  }

  // Consolidate image upload methods
  uploadProductImages(files: FileList): Observable<{imageUrls: string[]}> {
    const formData = new FormData();
    Array.from(files).forEach(file => {
      formData.append('imageUrls', file);
    });
    return this.http.post<{imageUrls: string[]}>('http://localhost:5000/upload', formData);
  }

  // Keep utility methods
  onProductUpdate(): Observable<Product> {
    return this.productUpdated.asObservable();
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error details:', {
      status: error.status,
      message: error.error,
      headers: error.headers.keys(),
      url: error.url
    });
    
    return throwError(() => error);
  }
}