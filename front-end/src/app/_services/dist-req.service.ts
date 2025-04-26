import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable ,Subject} from 'rxjs';
import { DistReq } from '../_models/dist-req.model';
import { tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DistReqService {
  private apiUrl = 'http://localhost:5000/distReq';
  private distReqUpdated = new Subject<DistReq>();
    constructor(private http: HttpClient) { }
  
    getAllDistributionReqs(): Observable<DistReq[]> {
      return this.http.get<DistReq[]>(`${this.apiUrl}/getAllDistributionReqs`);
    }
    getDistReqsByStatus(status: string): Observable<DistReq[]> {
      return this.http.get<DistReq[]>(`${this.apiUrl}/getDistReqsByStatus/${status}`);
    }

    getDistReqById(id: string): Observable<DistReq> {
      return this.http.get<DistReq>(`${this.apiUrl}/getDistReqById/${id}`);
    }

    createDistReq(distReq: DistReq): Observable<DistReq> {
      const distReqData = JSON.parse(JSON.stringify(distReq));
      delete distReqData._id;
        console.log('Adding distReq:', distReqData);
        return this.http.post<DistReq>(`${this.apiUrl}/createDistReq`, distReqData).pipe(
            tap(createdDistReq => {
                console.log('DistReq added successfully:', createdDistReq);
            })
        );
      }
  
      changeDistReqStatus(id: string, status: string,message:string): Observable<DistReq> {
        return this.http.put<DistReq>(`${this.apiUrl}/changeDistReqStatus/${id}`, {"status":status,"message":message}).pipe(
          tap(updateDistReq => {
            console.log('Update successful:', updateDistReq);
            this.distReqUpdated.next(updateDistReq);
          })
        );
    }
    
    deleteDistReq(id: string): Observable<void> {
        console.log('Deleting DistReq at:', `${this.apiUrl}/deleteDistReq/${id}`);
        return this.http.delete<void>(`${this.apiUrl}/deleteDistReq/${id}`).pipe(
          tap(() => console.log('Delete successful'))
        );
      }
      onDistReqUpdate(): Observable<DistReq> {
          return this.distReqUpdated.asObservable();
      }
}
