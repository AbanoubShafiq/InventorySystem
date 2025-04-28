import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubInventoryServicesService {

  baseUrl:string = "http://localhost:5000/subInventory";

  constructor(
    private http: HttpClient,

  ) { }


  getSubInventoryRelatedToBranch (branchName:string) : Observable<any>
  {
    return this.http.get(`${this.baseUrl}/getActiveSubInventoriesByBranchName/${branchName}`)
  }

  getSubInventoryById (subInventoryId:string): Observable<any>
  {
    return this.http.get(`${this.baseUrl}/getSubInventoryById/${subInventoryId}`);
  }




}
