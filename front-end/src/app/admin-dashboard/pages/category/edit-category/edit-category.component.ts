import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../../../_services/category.service';
import { firstValueFrom } from 'rxjs';
import { Category } from '../../../../_models/category.model';
import { ToastrService } from 'ngx-toastr';
import { UploadComponent } from 'src/app/upload/upload.component';

@Component({
  selector: 'app-edit-category',
  imports: [FormsModule, CommonModule, UploadComponent],
  templateUrl: './edit-category.component.html',
  styleUrl: './edit-category.component.css'
})
export class EditCategoryComponent {
  
  @Input() show = false;
  @Input() categoryData!: Category; 

  @Output() close = new EventEmitter<void>();
  @Output() updated = new EventEmitter<void>();

  loading = false;

  constructor(
    private categoryService: CategoryService,
    private toastr: ToastrService,
  ) {}


  onImagesUploaded(imageUrls: string[]) {
    this.categoryData.image = imageUrls;
  }    

  async onSubmit(): Promise<void> {
    try {
      this.loading = true;
      const updatedCategory: Category = {
        ...this.categoryData,
        name:this.categoryData.name.trim(),
        description:this.categoryData.description?.trim(),
      };

      await firstValueFrom(this.categoryService.updateCategory(this.categoryData._id, updatedCategory));

      this.toastr.success('Category updated successfully!', 'Success');
      this.updated.emit();
      this.close.emit();
    } catch (error) {
      console.error('Error updating Category:', error);
      this.toastr.error('Failed to update Category. Please try again.', 'Error');
    } finally {
      this.loading = false;
    }
  }

  onClose(): void {
    this.close.emit();
  }

  removeImage() {
    this.categoryData.image=[];
  }
}
