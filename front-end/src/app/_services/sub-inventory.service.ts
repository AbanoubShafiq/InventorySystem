import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable ,Subject} from 'rxjs';
import { SubInventory } from '../_models/sub-inventory.model';
import { tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SubInventoryService {
  private apiUrl = 'http://localhost:5000/subInventory';
    private subInventoryUpdated = new Subject<SubInventory>();
      constructor(private http: HttpClient) { }
    
      getAllSubInventorys(): Observable<SubInventory[]> {
        return this.http.get<SubInventory[]>(`${this.apiUrl}/getAllSubInventories`);
      }
      getSubInventoriesByBranchName(branchName: string): Observable<SubInventory[]> {
        return this.http.get<SubInventory[]>(`${this.apiUrl}/getSubInventoriesByBranchName/${branchName}`);
      }
      getActiveSubInventoriesByBranchName(branchName: string): Observable<SubInventory[]> {
        return this.http.get<SubInventory[]>(`${this.apiUrl}/getActiveSubInventoriesByBranchName/${branchName}`);
      }
      getDeactiveSubInventoriesByBranchName(branchName: string): Observable<SubInventory[]> {
        return this.http.get<SubInventory[]>(`${this.apiUrl}/getDeactiveSubInventoriesByBranchName/${branchName}`);
      }


      getSubInventoryById(id: string): Observable<SubInventory> {
        return this.http.get<SubInventory>(`${this.apiUrl}/getSubInventoryById/${id}`);
      }
  
      CreateSubInventory(id: string,product:string,branch:string,quantity:number): Observable<SubInventory> {
        // const subInventoryData = JSON.parse(JSON.stringify(subInventory));
        // delete subInventoryData._id;
        //   console.log('Adding SubInventory:', subInventoryData);
          return this.http.post<SubInventory>(`${this.apiUrl}/CreateSubInventory`, 
            {"mainInventory":id,"product":product,"branch":branch,"quantity":quantity}).pipe(
              tap(createdSubInventory => {
                  console.log('SubInventory added successfully:',
                    {"mainInventory":id,"product":product,"branch":branch,"quantity":quantity});
              })
          );
        }
    
        activeSubInventory(id: string): Observable<SubInventory> {
          return this.http.post<SubInventory>(`${this.apiUrl}/activeSubInventory/${id}`, {}).pipe(
            tap(updateSubInventory => {
              console.log('Update successful:', updateSubInventory);
              this.subInventoryUpdated.next(updateSubInventory);
            })
          );
      }
      deactiveSubInventory(id: string): Observable<SubInventory> {
          return this.http.post<SubInventory>(`${this.apiUrl}/deactiveSubInventory/${id}`,{}).pipe(
            tap(updateSubInventory => {
              console.log('Update successful:', updateSubInventory);
              this.subInventoryUpdated.next(updateSubInventory);
            })
          );
      }
      decreaseSubInventoryQuantity(id: string,quantity:number): Observable<SubInventory> {
          return this.http.put<SubInventory>(`${this.apiUrl}/decreaseSubInventoryQuantity/${id}`,{"quantityToDecrease":quantity}).pipe(
            tap(updateSubInventory => {
              console.log('Update successful:', updateSubInventory);
              this.subInventoryUpdated.next(updateSubInventory);
            })
          );
      }
      increaseSubInventoryQuantity(id: string, quantity: number): Observable<SubInventory> {
        return this.http.put<SubInventory>(`${this.apiUrl}/increaseSubInventoryQuantity/${id}`,{"quantityToIncrease":quantity}).pipe(
          tap(updateSubInventory => {
            console.log('Update successful:', updateSubInventory);
            this.subInventoryUpdated.next(updateSubInventory);
          })
        );
      }
      
      
      deleteSubInventory(id: string): Observable<void> {
          console.log('Deleting SubInventory at:', `${this.apiUrl}/deleteSubInventory/${id}`);
          return this.http.delete<void>(`${this.apiUrl}/deleteSubInventory/${id}`).pipe(
            tap(() => console.log('Delete successful'))
          );
        }
        onSubInventoryUpdate(): Observable<SubInventory> {
            return this.subInventoryUpdated.asObservable();
      }

      getDeactiveSubInventoriesByBranchId(id: string): Observable<SubInventory[]> {
        return this.http.get<SubInventory[]>(`${this.apiUrl}/getDeactiveSubInventoriesByBranchId/${id}`);
      }

      getActiveSubInventoriesByBranchId(id: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/getActiveSubInventoriesByBranchId/${id}`);
      }

}
