import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SalesClerkInventoryService } from '../services/sales-clerk-inventory.service';
import { SalesClerkInventory } from '../models/sales-clerk-inventory.model';
import { BranchService } from '../services/branch.service';

@Component({
  selector: 'app-branch-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './branch-products.component.html',
  styleUrls: ['./branch-products.component.css']
})
export class BranchProductsComponent implements OnInit {
  products: SalesClerkInventory[] = [];
  filteredProducts: SalesClerkInventory[] = [];
  branches: any[] = [];
  selectedBranch: string = '';
  searchTerm: string = '';
  statusFilter: string = 'all';
  loading = false;
  error: string | null = null;

  constructor(
    private salesClerkService: SalesClerkInventoryService,
    private branchService: BranchService
  ) {}

  ngOnInit() {
    this.loadBranches();
  }

  loadBranches() {
    this.loading = true;
    this.branchService.getActiveBranches().subscribe({
      next: (branches) => {
        
        this.branches = branches;
        if (this.branches.length > 0) {
          this.selectedBranch = this.branches[0].branchName;
          this.loadProducts();
        }
      },
      error: (error) => {
        console.error('Error loading branches:', error);
        this.error = 'Failed to load branches';
        this.loading = false;
      }
    });
  }

  onBranchChange() {
    this.loadProducts();
  }

  loadProducts() {
    if (!this.selectedBranch) return;
    
    this.loading = true;
    this.error = null;

    let request$;
    switch(this.statusFilter) {
      case 'active':
        request$ = this.salesClerkService.getActiveBranchInventory(this.selectedBranch);
        break;
      case 'inactive':
        request$ = this.salesClerkService.getDeactiveBranchInventory(this.selectedBranch);
        break;
      default:
        request$ = this.salesClerkService.getBranchInventory(this.selectedBranch);
    }

    request$.subscribe({
      next: (data) => {
        this.products = data;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error:', error);
        this.error = 'Failed to load products';
        this.loading = false;
      }
    });
  }

  onStatusFilterChange() {
    this.loadProducts();
  }

  applyFilter() {
    if (!this.searchTerm.trim()) {
      this.filteredProducts = this.products;
      return;
    }

    const search = this.searchTerm.toLowerCase();
    this.filteredProducts = this.products.filter(product => 
      product.name.toLowerCase().includes(search) ||
      product.inventoryName.toLowerCase().includes(search)
    );
  }

  applyFilters() {
    this.filteredProducts = this.products.filter(product => {
      const matchesSearch = 
        product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        product.inventoryName.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = 
        this.statusFilter === 'all' || 
        (this.statusFilter === 'active' && product.isActive) ||
        (this.statusFilter === 'inactive' && !product.isActive);
      
      return matchesSearch && matchesStatus;
    });
  }

  toggleStatus(product: SalesClerkInventory) {
    this.loading = true;
    this.salesClerkService.toggleProductStatus(product._id, product.isActive)
      .subscribe({
        next: () => {
          product.isActive = !product.isActive;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error toggling status:', error);
          this.error = 'Failed to update product status';
          this.loading = false;
        }
      });
  }

  requestRestock(product: SalesClerkInventory) {
    console.log('Request restock for:', product);
    // To be implemented
  }

  deleteProduct(product: SalesClerkInventory) {
    if (confirm(`Are you sure you want to delete ${product.name}?`)) {
      this.loading = true;
      this.salesClerkService.deleteProduct(product._id).subscribe({
        next: () => {
          this.products = this.products.filter(p => p._id !== product._id);
          this.applyFilter();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error deleting product:', error);
          this.error = 'Failed to delete product';
          this.loading = false;
        }
      });
    }
  }
}
