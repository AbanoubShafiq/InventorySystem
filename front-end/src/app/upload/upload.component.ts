import { Component, EventEmitter, Output } from '@angular/core';
import { UploadService } from '../_services/upload.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-upload',
  standalone: true, 
  imports: [CommonModule],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.css'
})
export class UploadComponent {
  imageUrls: string[] = []; 

  @Output() imagesUploaded = new EventEmitter<string[]>();

  constructor(private uploadService: UploadService) {}

  onFilesSelected(event: any) {
    const files: FileList = event.target.files;
    if (files.length > 0) {
      this.uploadService.uploadMultipleImages(files).subscribe({
        next: (response) => { 
          this.imageUrls = response.imageUrls;
          this.imagesUploaded.emit(this.imageUrls);
        },
        error: (error) => console.error('❌ Upload Error:', error),
        complete: () => console.log('✅ Image upload completed!')
      });
    }
  }
  
}
