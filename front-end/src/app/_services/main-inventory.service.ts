import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable ,Subject} from 'rxjs';
import { MainInventory } from '../_models/main-inventory.model';
import { tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MainInventoryService {
  private apiUrl = 'http://localhost:5000/mainInventory';
  private mainInventoryUpdated = new Subject<MainInventory>();
    constructor(private http: HttpClient) { }
  
    getAllMainInventory(): Observable<MainInventory[]> {
      const headers = new HttpHeaders({
        'Authorization': `Bearer my-token` // ✅ استبدلي `my-token` بالتوكن الفعلي
      });
    
      return this.http.get<MainInventory[]>(`${this.apiUrl}/getAllMainInventory`, { headers }).pipe(
        tap(response => console.log('Response:', response)) // ✅ يتم الطباعة عند تنفيذ الـ subscribe
      );
    }
    

    getMainInventoryById(id: string): Observable<MainInventory> {
      return this.http.get<MainInventory>(`${this.apiUrl}/getMainInventoryById/${id}`);
    }

    createMainInventory(id: string,quantity:number): Observable<MainInventory> {
      // const mainInventoryData = JSON.parse(JSON.stringify(mainInventory));
      // delete mainInventoryData._id;
        // console.log('Adding MainInventory:', mainInventoryData);
        return this.http.post<MainInventory>(`${this.apiUrl}/createMainInventory`, {"product":id,"quantity":quantity}).pipe(
            tap(createdMainInventory => {
                console.log('MainInventory added successfully:', {"product":id,"quantity":quantity});
            })
        );
      }
  
    updateMainInventory(id: string, mainInventory: MainInventory): Observable<MainInventory> {
      console.log('Updating MainInventory at:', `${this.apiUrl}/updateMainInventoryById/${id}`);
        return this.http.put<MainInventory>(`${this.apiUrl}/updateMainInventoryById/${id}`, mainInventory).pipe(
          tap(updateMainInventory => {
            console.log('Update successful:', updateMainInventory);
            this.mainInventoryUpdated.next(updateMainInventory);
          })
        );
    }
    
    deleteMainInventory(id: string): Observable<void> {
        console.log('Deleting MainInventory at:', `${this.apiUrl}/deleteMainInventory/${id}`);
        return this.http.delete<void>(`${this.apiUrl}/deleteMainInventory/${id}`).pipe(
          tap(() => console.log('Delete successful'))
        );
      }
      onMainInventoryUpdate(): Observable<MainInventory> {
          return this.mainInventoryUpdated.asObservable();
      }
}
