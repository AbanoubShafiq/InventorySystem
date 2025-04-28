import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../../_services/product.service';
import { Product } from '../../../_models/product.model';
import Swal from 'sweetalert2';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AddProductComponent } from './add-product/add-product.component';
import { firstValueFrom, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UpdateProductComponent } from './update-product/update-product.component';
import { MainInventoryService } from 'src/app/_services/main-inventory.service';

@Component({
  selector: 'app-products',
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule, MatMenuModule, AddProductComponent, UpdateProductComponent],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  loading = false;
  searchTerm: string = '';
  sortColumn: keyof Product = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';
  statusFilter: 'all' | 'active' | 'inactive' = 'all';
  showAddModal = false;
  showEditModal = false;
  editingProduct?: Product;
  selectedFiles: File[] = [];
  error: string | null = null;
  private destroy$ = new Subject<void>();

  productData: Product = this.getInitialProductData();

  constructor(private productService: ProductService, private cdr: ChangeDetectorRef ,private mainInventoryService:MainInventoryService) {}

  ngOnInit(): void {
    this.loadProducts();
    this.subscribeToProductUpdates();
  }

  getInitialProductData(): Product {
    return {
      _id: '',
      name: '',
      description: '',
      price: 0,
      prevPrice: 0,
      noOfSale: 0,
      images: [],
      isActive: true,
      quantity: 0,
      distributedItems: 0,
      sellerId: {_id:'679bd13b5503613c0a14eb9b',firstName:'',lastName:''},
      categoryId: {_id:'',name:''},
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }  

  subscribeToProductUpdates(): void {
    this.productService.onProductUpdate()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.loadProducts());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async loadProducts(): Promise<void> {
    this.loading = true;
    this.error = null;
    try {
      const data = await firstValueFrom(this.productService.getAllProducts());
      this.products = [...data];
      this.filteredProducts = [...data];
      this.applyFilters();
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error loading products:', error);
      this.error = 'Failed to load products';
    } finally {
      this.loading = false;
    }
  }

  deleteProduct(id: string): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.deleteProduct(id).subscribe({
          next: () => {
            this.loadProducts();
            Swal.fire('Deleted!', 'Product has been deleted.', 'success');
          },
          error: () => Swal.fire('Error!', 'Failed to delete product.', 'error')
        });
      }
    });
  }

  createMainInventory(id: string): void {
    Swal.fire({
      title: 'Create Main Inventory',
      input: 'number',
      inputLabel: 'Enter the initial quantity',
      inputAttributes: {
        min: '1',
        step: '1'
      },
      showCancelButton: true,
      confirmButtonText: 'Create',
      cancelButtonText: 'Cancel',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-secondary',
      },
      preConfirm: (quantity) => {
        if (!quantity || quantity <= 0) {
          Swal.showValidationMessage('Please enter a valid quantity');
        }
        return quantity;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const initialQuantity = Number(result.value);
        
        this.mainInventoryService.createMainInventory(id, initialQuantity).subscribe({
          next: () => {
            this.loadProducts();
            Swal.fire({
              title: 'Success!',
              text: `Main Inventory created with an initial quantity of ${initialQuantity}.`,
              icon: 'success',
              confirmButtonText: 'OK',
              customClass: {
                confirmButton: 'btn btn-success'  
              }
            });
          },
          error: (error) => {
            console.error('Error creating inventory:', error);
            Swal.fire({
              title: 'Error!',
              text: error?.error?.message || 'Failed to create main inventory.',
              icon: 'error',
              confirmButtonText: 'OK',
              customClass: {
                confirmButton: 'btn btn-danger'
              }
            });
          }
        });
      }
    });
  }  

  createProdReq(product: string, seller: string): void {
    Swal.fire({
      title: 'Create Product Request',
      input: 'number',
      inputLabel: 'Enter the requested quantity',
      inputAttributes: {
        min: '1',
        step: '1'
      },
      showCancelButton: true,
      confirmButtonText: 'Request',
      cancelButtonText: 'Cancel',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-secondary',
      },
      preConfirm: (quantity) => {
        if (!quantity || quantity <= 0) {
          Swal.showValidationMessage('Please enter a valid quantity');
        }
        return quantity;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const quantityRequested = Number(result.value);
        this.productService.createProdReq(product, seller, "67ba0e63dc1b0f8d419f6d9e", quantityRequested).subscribe({
          next: () => {
            Swal.fire({
              title: 'Success!',
              text: `Product request for ${quantityRequested} units has been submitted.`,
              icon: 'success',
              confirmButtonText: 'OK',
              customClass: {
                confirmButton: 'btn btn-success'
              }
            });
          },
          error: (error) => {
            console.error('Error creating product request:', error);
            Swal.fire({
              title: 'Error!',
              text: error?.error?.message || 'Failed to submit product request.',
              icon: 'error',
              confirmButtonText: 'OK',
              customClass: {
                confirmButton: 'btn btn-danger'
              }
            });
          }
        });
      }
    });
  }
  
  
  activeProduct(id: string): void {
        this.productService.activeProduct(id,this.productData).subscribe({
          next: () => {
            this.loadProducts();
          },
          error:(error) => console.error('❌ Error:', error)
        });
      }
  
      inActiveproduct(id: string): void {
        this.productService.deactiveProduct(id,this.productData).subscribe({
          next: () => {
            this.loadProducts();
          },
          error:(error) => console.error('❌ Error:', error)
        });
      }
  
      toggleProductStatus(product: Product) {
        if (product.isActive) {
          this.inActiveproduct(product._id);
        } else {
          this.activeProduct(product._id); 
        }
      }
  get activeProductsCount(): number {
    return this.products.filter(product => product.isActive === true).length;
  }

  get inactiveproductCount(): number {
    return this.products.filter(product => product.isActive === false).length;
  }

  get inStockProductsCount(): number {
    return this.products.filter(product => product.quantity > 0).length;
  }
  
  get outOfStockProductsCount(): number {
    return this.products.filter(product => product.quantity === 0).length;
  }
  

  applyFilters(): void {
    let filtered = [...this.products];
    if (this.searchTerm) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchLower)
      );
    }
    if (this.statusFilter !== 'all') {
      filtered = filtered.filter(product => product.isActive === (this.statusFilter === 'active'));
    }
    filtered.sort((a, b) => {
      const aValue = a[this.sortColumn];
      const bValue = b[this.sortColumn];
      if (aValue == null || bValue == null) return 0;
      const direction = this.sortDirection === 'asc' ? 1 : -1;
      return typeof aValue === 'string' ? direction * aValue.localeCompare(String(bValue)) : direction * ((aValue as number) - (bValue as number));
    });
    this.filteredProducts = [...filtered];
    this.cdr.detectChanges();
  }

  onSearch(): void {
    this.applyFilters();
  }

  onStatusFilterChange(): void {
    this.applyFilters();
  }

  sort(column: keyof Product): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.applyFilters();
  }

  openAddModal(): void {
    this.productData = this.getInitialProductData();
    this.showAddModal = true;
  }

  openEditModal(product: Product): void {
    this.editingProduct = product;
    this.productData = { ...product };
    this.showEditModal = true;
    console.log("✅ Opening Edit Modal with Data:", this.productData);
  }

  onProductSaved(): void {
    this.loadProducts();
    this.showAddModal = false;
  }

  onProductUpdated(): void {
    this.showEditModal = false;
    this.loadProducts();
  }
}


