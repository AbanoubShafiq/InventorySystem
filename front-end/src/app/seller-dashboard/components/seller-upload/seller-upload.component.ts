import { Component, EventEmitter, Input, Output, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SellerUploadService } from '../../services/seller-upload.service';

interface UploadResponse {
  success: boolean;
  imageUrls: string[];
}

@Component({
  selector: 'app-seller-upload',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mb-3">
      <label class="btn btn-primary" [class.disabled]="uploading || isDisabled">
        {{ uploading ? 'Uploading...' : 'Upload Images' }}
        <input type="file" 
               multiple 
               accept="image/*"
               [attr.disabled]="isDisabled ? '' : null"
               (change)="onFilesSelected($event)"
               style="display: none;">
      </label>

      <div class="preview-images mt-2 d-flex flex-wrap gap-2">
        <div *ngFor="let url of existingImages; let i = index" class="preview-image">
          <img [src]="url" 
               class="img-thumbnail" 
               style="width: 100px; height: 100px; object-fit: cover;">
          <button type="button" class="btn btn-sm btn-danger position-absolute"
                  style="top: 0; right: 0;"
                  (click)="removeImage(i)">×</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .preview-image {
      position: relative;
      display: inline-block;
    }
    
    .img-thumbnail {
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .disabled {
      pointer-events: none;
      opacity: 0.65;
    }
  `]
})
export class SellerUploadComponent implements OnDestroy {
  @Input() isDisabled = false; // Changed from disabled to isDisabled
  @Output() imagesUploaded = new EventEmitter<string[]>();
  @Input() existingImages: string[] = [];
  
  uploading = false;
  previewUrls: string[] = [];

  constructor(private uploadService: SellerUploadService) {}


  onFilesSelected(event: Event): void {
    const element = event.target as HTMLInputElement;
    const files = element.files;
    
    if (files && files.length > 0) {
      this.uploading = true;
      
      this.previewUrls = Array.from(files).map(file => URL.createObjectURL(file));
      this.existingImages = [...this.existingImages, ...this.previewUrls];

      this.uploadService.uploadProductImages(files).subscribe({
        next: (response: UploadResponse) => {
          if (response.success) {
            this.cleanupPreviewUrls();
            this.existingImages = [
              ...this.existingImages.filter(url => !this.previewUrls.includes(url)), 
              ...response.imageUrls
            ];
            this.imagesUploaded.emit(this.existingImages);
          }
        },
        error: (error) => {
          console.error('Upload error:', error);
          this.cleanupPreviewUrls();
          this.uploading = false;
        },
        complete: () => {
          this.uploading = false;
        }
      });
    }
  }

  private cleanupPreviewUrls(): void {
    this.previewUrls.forEach(url => URL.revokeObjectURL(url));
    this.existingImages = this.existingImages.filter(url => !this.previewUrls.includes(url));
    this.previewUrls = [];
  }

  removeImage(index: number): void {
    const removedUrl = this.existingImages[index];
    if (this.previewUrls.includes(removedUrl)) {
      URL.revokeObjectURL(removedUrl);
    }
    this.existingImages = this.existingImages.filter((_, i) => i !== index);
    this.imagesUploaded.emit(this.existingImages);
  }

  ngOnDestroy(): void {
    this.cleanupPreviewUrls();
  }
}