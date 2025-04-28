import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { SellerUploadComponent } from '../../components/seller-upload/seller-upload.component';
import { Product, Category } from '../../models/product.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [CommonModule, FormsModule, SellerUploadComponent],
  templateUrl: './edit-product.component.html'
})
export class EditProductComponent implements OnInit {
  @Input() show = false;
  @Input() product!: Product;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  categories: Category[] = [];
  loading = false;
  productCopy!: Product;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.loadCategories();
    if (this.product) {
      this.productCopy = { ...this.product };
    }
  }

  private loadCategories() {
    this.categoryService.getActiveCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        Swal.fire('Error', 'Failed to load categories', 'error');
      }
    });
  }

  onImagesUploaded(uploadedUrls: string[]): void {
    this.productCopy.images = uploadedUrls;
  }

  onSubmit(): void {
    if (!this.validateForm()) return;

    this.loading = true;
    const updateData = {
      name: this.productCopy.name,
      description: this.productCopy.description,
      price: this.productCopy.price,
      quantity: this.productCopy.quantity,
      categoryId: typeof this.productCopy.categoryId === 'string' 
        ? this.productCopy.categoryId 
        : this.productCopy.categoryId._id,
      sellerId: this.productCopy.sellerId,
      images: this.productCopy.images,
      isActive: this.productCopy.isActive
    };

    this.productService.updateProduct(this.product._id, updateData).subscribe({
      next: () => {
        Swal.fire('Success', 'Product updated successfully', 'success');
        this.saved.emit();
        this.close.emit();
      },
      error: (error) => {
        console.error('Error updating product:', error);
        Swal.fire('Error', 'Failed to update product', 'error');
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  private validateForm(): boolean {
    if (!this.productCopy.name?.trim()) {
      Swal.fire('Error', 'Product name is required', 'error');
      return false;
    }
    if (!this.productCopy.categoryId) {
      Swal.fire('Error', 'Please select a category', 'error');
      return false;
    }
    if (this.productCopy.price <= 0) {
      Swal.fire('Error', 'Price must be greater than 0', 'error');
      return false;
    }
    if (this.productCopy.quantity < 0) {
      Swal.fire('Error', 'Quantity cannot be negative', 'error');
      return false;
    }
    return true;
  }

  onClose(): void {
    this.close.emit();
  }
}
