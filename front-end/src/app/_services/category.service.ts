import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable ,Subject} from 'rxjs';
import { Category } from '../_models/category.model';
import { tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
private apiUrl = 'http://localhost:5000/categories';
  private categoryUpdated = new Subject<Category>();
    constructor(private http: HttpClient) { }
  
    getAllCategorier(): Observable<Category[]> {
      return this.http.get<Category[]>(this.apiUrl);
    }

    getCategoryById(id: string): Observable<Category> {
      return this.http.get<Category>(`${this.apiUrl}/${id}`);
    }

    getCategoryByName(name: string): Observable<Category> {
      return this.http.get<Category>(`${this.apiUrl}/CategoryByName/${name}`);
    }

    getCategorierByActive(): Observable<Category[]> {
      return this.http.get<Category[]>(`${this.apiUrl}/get/active`);
    }

    createCategory(category: Category): Observable<Category> {
      const categoryData = JSON.parse(JSON.stringify(category));
      delete categoryData._id;
        console.log('Adding category:', categoryData);
        return this.http.post<Category>(this.apiUrl, categoryData).pipe(
            tap(createdCategory => {
                console.log('category added successfully:', createdCategory);
            })
        );
      }
  
    updateCategory(id: string, category: Category): Observable<Category> {
      console.log('Updating category at:', `${this.apiUrl}/${id}`);
        return this.http.put<Category>(`${this.apiUrl}/${id}`, category).pipe(
          tap(updateCategory => {
            console.log('Update successful:', updateCategory);
            this.categoryUpdated.next(updateCategory);
          })
        );
    }
    toggleStatusCategory(id: string): Observable<Category> {
        return this.http.put<Category>(`${this.apiUrl}/toggle/${id}`,{}).pipe(
          tap(updateCategory => {
            console.log('Update successful:', updateCategory);
            this.categoryUpdated.next(updateCategory);
          })
        );
    }

    deleteCategory(id: string): Observable<void> {
        console.log('Deleting category at:', `${this.apiUrl}/${id}`);
        return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
          tap(() => console.log('Delete successful'))
        );
      }
      onCategoryUpdate(): Observable<Category> {
          return this.categoryUpdated.asObservable();
      }
}
