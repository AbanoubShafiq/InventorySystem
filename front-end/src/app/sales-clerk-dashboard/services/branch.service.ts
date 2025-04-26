import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Branch {
  _id: string;
  branchName: string;
  location: string;
  type: 'online' | 'offline';
  isActive: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class BranchService {
  private apiUrl = 'http://localhost:5000/branches';

  constructor(private http: HttpClient) {}

  getAllBranches(): Observable<Branch[]> {
    return this.http.get<Branch[]>(this.apiUrl);
  }

  getActiveBranches(): Observable<Branch[]> {
    return this.http.get<Branch[]>(`${this.apiUrl}/get/active`);
  }
}