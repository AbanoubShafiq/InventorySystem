import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface UploadResponse {
  imageUrls: string[];
  success: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SellerUploadService {
  private apiUrl = 'http://localhost:5000/upload';

  constructor(private http: HttpClient) {}

  uploadProductImages(files: FileList): Observable<UploadResponse> {
    const formData = new FormData();
    Array.from(files).forEach(file => {
      formData.append('imageUrls', file);
    });

    return this.http.post<UploadResponse>(this.apiUrl, formData);
  }
}