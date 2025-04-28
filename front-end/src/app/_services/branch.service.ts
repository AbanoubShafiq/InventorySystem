import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable ,Subject} from 'rxjs';
import { Branch } from '../_models/branch.model';
import { tap} from 'rxjs/operators';

import { CookieService } from 'ngx-cookie-service'; 
@Injectable({
  providedIn: 'root'
})
export class BranchService {
  private apiUrl = 'http://localhost:5000/branches';
  private branchUpdated = new Subject<Branch>();

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  private getAuthToken(): string {
    return this.cookieService.get('token'); 
  }

  private getHeaders() {
    const token = this.getAuthToken();
    console.log('Token in Headers:', token); 
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }  
    getAllBranches(): Observable<Branch[]> {
      return this.http.get<Branch[]>(this.apiUrl);
    }
    getbranchesBasedOnType(type: string): Observable<Branch[]> {
      return this.http.get<Branch[]>(`${this.apiUrl}/branchesByType/${type}`);
    }

    getBranchById(id: string): Observable<Branch> {
      return this.http.get<Branch>(`${this.apiUrl}/${id}`,{ headers: this.getHeaders() });
    }

    getBranchByName(name: string): Observable<Branch> {
      return this.http.get<Branch>(`${this.apiUrl}/branchByName/${name}`,{ headers: this.getHeaders() });
    }

    getBranchesByActive(): Observable<Branch[]> {
      return this.http.get<Branch[]>(`${this.apiUrl}/get/active`);
    }

    createBranch(branch: Branch): Observable<Branch> {
      const branchData = JSON.parse(JSON.stringify(branch));
      delete branchData._id;
        console.log('Adding branch:', branch);
        return this.http.post<Branch>(this.apiUrl, branchData).pipe(
            tap(createdBranch => {
                console.log('branch added successfully:', createdBranch);
            })
        );
      }
  
    updateBranch(id: string, branch: Branch): Observable<Branch> {
      console.log('Updating branch at:', `${this.apiUrl}/${id}`);
        return this.http.put<Branch>(`${this.apiUrl}/${id}`, branch).pipe(
          tap(updateBranch => {
            console.log('Update successful:', updateBranch);
            this.branchUpdated.next(updateBranch);
          })
        );
    }
    toggleStatusBranch(id: string): Observable<Branch> {
        return this.http.put<Branch>(`${this.apiUrl}/toggle/${id}`,{}).pipe(
          tap(updateBranch => {
            console.log('Update successful:', updateBranch);
            this.branchUpdated.next(updateBranch);
          })
        );
    }

    deleteBranch(id: string): Observable<void> {
        console.log('Deleting branch at:', `${this.apiUrl}/${id}`);
        return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
          tap(() => console.log('Delete successful'))
        );
      }
      onBranchUpdate(): Observable<Branch> {
          return this.branchUpdated.asObservable();
      }
}
