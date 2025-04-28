import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable,Subject } from 'rxjs';
import { Product } from '../_models/product.model';
import { tap} from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = 'http://localhost:5000/product';
  private productUpdated = new Subject<Product>();
  constructor(private http: HttpClient) { }
  
  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/getAllProducts`);
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/getProductById/${id}`);
  }

  createProduct(product: Product): Observable<Product> {
    const productData = JSON.parse(JSON.stringify(product));
      delete productData._id;
        console.log('Adding product:', productData);
    return this.http.post<Product>(`${this.apiUrl}/createProduct`, productData).pipe(
        tap(createdProduct => {
            console.log('Product added successfully:', createdProduct);
        })
    );
}


  updateProduct(id: string, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/updateProduct/${id}`, product).pipe(
      tap(updatedProduct => {
        console.log('Update successful:', updatedProduct);
        this.productUpdated.next(updatedProduct);
      })
    );
}

  activeProduct(id: string, product: Product): Observable<Product> {
      return this.http.post<Product>(`${this.apiUrl}/activeProduct/${id}`, product).pipe(
        tap(updateProduct => {
          console.log('Update successful:', updateProduct );
          this.productUpdated.next(updateProduct );
        })
      );
  }
  deactiveProduct(id: string, product: Product): Observable<Product> {
      return this.http.post<Product>(`${this.apiUrl}/deactiveProduct/${id}`, product).pipe(
        tap(updateProduct => {
          console.log('Update successful:', updateProduct );
          this.productUpdated.next(updateProduct );
        })
      );
  }


  deleteProduct(id: string): Observable<void> {
    console.log('Deleting product at:', `${this.apiUrl}/${id}`);
    return this.http.delete<void>(`${this.apiUrl}/deleteProduct/${id}`).pipe(
      tap(() => console.log('Delete successful'))
    );
  }
  onProductUpdate(): Observable<Product> {
      return this.productUpdated.asObservable();
  }

  createProdReq(product: string,seller:string,superAdmin:string,requestedQuantity:number): Observable<any> {
    return this.http.post<Product>(`http://localhost:5000/prodReq/createProdReq`,{
      "product":product,"seller":seller,"superAdmin":superAdmin,"requestedQuantity":requestedQuantity
    } ).pipe(
        tap(createdProduct => {
            console.log('ProdReq added successfully:', createdProduct);
        })
    );
}
}
