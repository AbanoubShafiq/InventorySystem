import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private uploadUrl = 'http://localhost:5000/upload';

  constructor(private http: HttpClient) {}

  uploadImage(file: File): Observable<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post<{ imageUrl: string }>(this.uploadUrl, formData);
  }

  uploadMultipleImages(files: FileList): Observable<{ imageUrls: string[] }> {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('imageUrls', files[i]);
    }
    return this.http.post<{ imageUrls: string[] }>(this.uploadUrl, formData);
  }
}
