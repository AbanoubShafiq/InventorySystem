import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-delete-product',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button class="btn btn-sm btn-outline-danger" (click)="confirmDelete()">
      <i class="fas fa-trash"></i> Delete
    </button>
  `
})
export class DeleteProductComponent {
  @Input() productId!: string;
  @Input() productName: string = '';
  @Output() deleted = new EventEmitter<void>();

  constructor(private productService: ProductService) {}

  confirmDelete(): void {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete ${this.productName || 'this product'}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteProduct();
      }
    });
  }

  private deleteProduct(): void {
    if (!this.productId) return;
    
    this.productService.deleteProduct(this.productId).subscribe({
      next: () => {
        Swal.fire('Deleted!', 'Product has been deleted.', 'success');
        this.deleted.emit();
      },
      error: (error) => {
        console.error('Error deleting product:', error);
        Swal.fire('Error!', 'Failed to delete product.', 'error');
      }
    });
  }
}