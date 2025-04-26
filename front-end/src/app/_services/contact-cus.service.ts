// contact.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ContactCusService {
  private apiUrl = 'http://localhost:5000/complaint';

  constructor(private http: HttpClient) {}

  // submitComplaint(complaint: any): Observable<any> {
  //   return this.http.post(this.apiUrl, complaint).pipe(
  //     catchError(this.handleError)
  //   );
  // }

  submitComplaint(complaint :any): Observable<any> 
  {
    return this.http.post(`${this.apiUrl}`,complaint);
  }



  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('Client-side error:', error.error.message);
    } else {
      console.error('Server-side error:', error.status, error.message);
    }
    return throwError(() => 'An error occurred. Please try again.');
  }
}