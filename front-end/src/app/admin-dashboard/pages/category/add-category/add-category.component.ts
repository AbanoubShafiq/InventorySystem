import { Component, Input, Output, EventEmitter,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../../../_services/category.service';
import { firstValueFrom } from 'rxjs';
import { Category } from '../../../../_models/category.model';
import { ToastrService } from 'ngx-toastr';
import { UploadComponent } from 'src/app/upload/upload.component';

@Component({
  selector: 'app-add-category',
  imports: [FormsModule,CommonModule,UploadComponent],
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.css'
})
export class AddCategoryComponent {
  @Input() show = false;
    @Input() categoryData: Category ={
      _id: '',
      name:'',
      description:'',
      image:[],
      isActive:true,
      createdAt:new Date()
    };
    @Output() close = new EventEmitter<void>();
    @Output() saved = new EventEmitter<void>();
  
    loading = false;
  
    constructor(private categoryService: CategoryService , private toastr: ToastrService) {}
    onImagesUploaded(imageUrls: string[]) {
      this.categoryData.image = imageUrls;
    }

    async onSubmit(): Promise<void> {
      try {
        this.loading = true;
        const categoryData:Category = {
        _id:this.categoryData._id,
        name:this.categoryData.name.trim(),
        description:this.categoryData.description?.trim(),
        image:  this.categoryData.image,
        isActive: this.categoryData.isActive,
        createdAt:this.categoryData.createdAt
        };
  
        await firstValueFrom(this.categoryService.createCategory(this.categoryData));
        this.toastr.success('Category added successfully!', 'Success');
        this.saved.emit();
        this.close.emit();
      } catch (error) {
        console.error('Error adding Category:', error);
        this.toastr.error('Failed to add Category. Please try again.', 'Error');
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
