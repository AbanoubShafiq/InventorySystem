import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { SellerUploadComponent } from '../../components/seller-upload/seller-upload.component';
import { Product, Category, ProductSubmitData } from '../../models/product.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SellerUploadComponent]
})
export class AddProductComponent implements OnInit {
  @Input() show = false;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  productForm!: FormGroup;
  categories: Category[] = [];
  loading = false;

  readonly ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];
  readonly MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
  readonly MAX_IMAGES = 8; // maximum images
  readonly MIN_IMAGES = 3; // minimum required images

  // Add previewUrls property
  previewUrls: string[] = [];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCategories();
  }

  private initForm(): void {
    this.productForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      price: [0, [Validators.required, Validators.min(0)]],
      quantity: [0, [Validators.required, Validators.min(0)]],
      categoryId: ['', [Validators.required]],
      images: [[]]
    });
  }

  private loadCategories() {
    this.loading = true;
    this.categoryService.getActiveCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        Swal.fire('Error', 'Failed to load categories', 'error');
        this.loading = false;
      }
    });
  }

  onImagesUploaded(uploadedUrls: string[]): void {
    console.log('Received uploaded image URLs:', uploadedUrls);
    const currentImages = this.productForm.get('images')?.value || [];
    
    if (currentImages.length + uploadedUrls.length > this.MAX_IMAGES) {
      Swal.fire('Error', `Maximum ${this.MAX_IMAGES} images allowed`, 'error');
      return;
    }

    if (uploadedUrls && uploadedUrls.length > 0) {
      // Combine existing images with new ones
      const updatedImages = [...currentImages, ...uploadedUrls];
      this.productForm.patchValue({ images: updatedImages });
    }
  }

  // Method to handle file selection
  onFileSelected(event: any): void {
    const files = event.target.files;
    if (files) {
      this.previewUrls = []; // Clear existing previews
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.previewUrls.push(e.target.result);
        };
        reader.readAsDataURL(file as Blob);
      });
    }
  }

  onSubmit(): void {
    if (!this.validateForm()) return;

    if (this.productForm.valid) {
      const formValues = this.productForm.value;
      const submitData: ProductSubmitData = {
        name: formValues.name.trim(),
        description: formValues.description.trim(),
        price: Number(formValues.price),
        quantity: Number(formValues.quantity),
        categoryId: formValues.categoryId,
        images: formValues.images || [],
        isActive: true
      };

      this.loading = true;
      this.productService.createProduct(submitData).subscribe({
        next: (response) => {
          console.log('Product created successfully:', response);
          Swal.fire('Success', 'Product created successfully', 'success');
          this.resetForm();
          this.saved.emit();
          this.close.emit();
        },
        error: (error) => {
          console.error('Error creating product:', error);
          Swal.fire('Error', 'Failed to create product', 'error');
        },
        complete: () => {
          this.loading = false;
        }
      });
    }
  }

  private validateForm(): boolean {
    const formValues = this.productForm.value;

    if (!formValues.images || formValues.images.length === 0) {
      Swal.fire('Error', 'At least one image is required', 'error');
      return false;
    }

    if (!formValues.name?.trim()) {
      Swal.fire('Error', 'Product name is required', 'error');
      return false;
    }
    if (!formValues.categoryId) {
      Swal.fire('Error', 'Please select a category', 'error');
      return false;
    }
    if (formValues.price <= 0) {
      Swal.fire('Error', 'Price must be greater than 0', 'error');
      return false;
    }
    if (formValues.quantity < 0) {
      Swal.fire('Error', 'Quantity cannot be negative', 'error');
      return false;
    }
    return true;
  }

  private resetForm(): void {
    this.productForm.reset({
      name: '',
      description: '',
      price: 0,
      quantity: 0,
      categoryId: '',
      images: []
    });
  }

  onClose(): void {
    this.close.emit();
  }

  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.style.display = 'none';
    }
  }

  // Method to remove image preview
  removeImage(index: number): void {
    this.previewUrls.splice(index, 1);
    // Also remove from the actual files array if you're tracking that
    const fileList = Array.from(this.productForm.get('images')?.value || []);
    fileList.splice(index, 1);
    this.productForm.patchValue({ images: fileList });
  }
}
