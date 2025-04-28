import { Component, OnInit, OnDestroy, ChangeDetectorRef  } from '@angular/core';
import { SubInventory } from '../../../_models/sub-inventory.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SubInventoryService } from '../../../_services/sub-inventory.service';
import Swal from 'sweetalert2';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { firstValueFrom, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ProductService } from 'src/app/_services/product.service';
import { forkJoin } from 'rxjs';
@Component({
  selector: 'app-sub-inventory',
  imports: [CommonModule,FormsModule,RouterModule,MatIconModule,MatMenuModule],
  templateUrl: './sub-inventory.component.html',
  styleUrl: './sub-inventory.component.css'
})
export class SubInventoryComponent implements OnInit, OnDestroy {
  branchName=''
  subInventories: SubInventory[] =[]
      filteredSubInventories: SubInventory[] = [];
      loading = false;
      searchTerm: string = '';
      sortColumn: keyof SubInventory = 'product';
      sortDirection: 'asc' | 'desc' = 'asc';
      statusFilter: 'all' | 'active' | 'inactive' = 'all';
      showAddModal = false;
      showEditModal = false;
      editingSubInventory?: SubInventory;
      selectedFiles: File[] = [];
      error: string | null = null;
      private destroy$ = new Subject<void>();
      subInventoryData: SubInventory = this.getInitialSubInventoryData();
      constructor(private subInventoryService: SubInventoryService , private cdr: ChangeDetectorRef,
        private route: ActivatedRoute,private productService:ProductService) {}
    
      ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
          this.branchName = params.get('branchName') || '';
          if (this.branchName) {
            this.loadSubInventories();
          }
        });
        this.subscribeToSubInventoryUpdates();
      }
      getInitialSubInventoryData(): SubInventory {
        return {
          _id: '',
          mainInventory: '',
          product: {_id:'',name:'',price:0,prevPrice:0,images:[],noOfSale:0,sellerId:{_id:'',firstName:'',lastName:''},categoryId:{_id:'',name:''}},
          branch: '',
          quantity: 0,
          numberOfSales: 0,
          lastUpdated:new Date(),
          active:true
        };
      }
      subscribeToSubInventoryUpdates(): void {
        this.subInventoryService.onSubInventoryUpdate()
          .pipe(takeUntil(this.destroy$))
          .subscribe(() => this.loadSubInventories());
      }
  
      ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
      }
  
    
      async loadSubInventories(): Promise<void> {
        this.loading = true;
        this.error = null;
        
        try {
          const data = await firstValueFrom(this.subInventoryService.getSubInventoriesByBranchName(this.branchName));
          this.subInventories = [...data]
      
          this.filteredSubInventories = [...this.subInventories];

          for (const item of this.subInventories) {
            if (item.product && item.product._id) {
              this.productService.getProductById(item.product._id).subscribe({
                next: (product:any) => {
                  item.product = product;
                  this.cdr.detectChanges();
                },
                error: (error) => console.error('❌ Error fetching product:', error)
              });
            }
          }
      
          this.applyFilters();
          this.cdr.detectChanges();
        } catch (error) {
          console.error('❌ Error loading SubInventories:', error);
          this.error = 'Failed to load SubInventories';
        } finally {
          this.loading = false;
          this.cdr.detectChanges();
        }
      }
      
  
      get activeSubInventoriessCount(): number {
        return this.subInventories.filter(subInventory => subInventory.active === true).length;
      }
    
      get inactiveSubInventoriesCount(): number {
        return this.subInventories.filter(subInventory => subInventory.active === false).length;
      }
    
    
      deleteSubInventory(id: string): void {
        Swal.fire({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
          if (result.isConfirmed) {
            this.subInventoryService.deleteSubInventory(id).subscribe({
              next: () => {
                this.loadSubInventories();
                Swal.fire('Deleted!', 'SubInventory has been deleted.', 'success');
              },
              error: (error) => {
                console.error('Error deleting SubInventory:', error);
                Swal.fire('Error!', 'Failed to delete SubInventory.', 'error');
              }
            });
          }
        });
      }

      increaseSubInventoryQuantity(id: string): void {
        Swal.fire({
          title: 'Increase Quantity',
          input: 'number',
          inputLabel: 'Enter the quantity to add',
          inputAttributes: {
            min: '1',
            step: '1'
          },
          showCancelButton: true,
          confirmButtonText: 'Increase',
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
            const quantityToAdd = Number(result.value);
            this.subInventoryService.increaseSubInventoryQuantity(id, quantityToAdd).subscribe({
              next: () => {
                this.loadSubInventories();
                Swal.fire({
                  title: 'Success!',
                  text: `Decreased quantity by ${quantityToAdd}.`,
                  icon: 'success',
                  confirmButtonText: 'OK',
                  customClass: {
                    confirmButton: 'btn btn-success'
                  }
                });
              },
              error: (error) => {
                console.error('Error updating quantity:', error);
                Swal.fire({
                  title: 'Error!',
                  text: error?.error?.message || 'Failed to increase quantity.',
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

      decreaseSubInventoryQuantity(id: string): void {
        Swal.fire({
          title: 'Decrease Quantity',
          input: 'number',
          inputLabel: 'Enter the quantity to subtract',
          inputAttributes: {
            min: '1',
            step: '1'
          },
          showCancelButton: true,
          confirmButtonText: 'Decrease',
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
            const quantityToSubtract = Number(result.value);
            this.subInventoryService.decreaseSubInventoryQuantity(id, quantityToSubtract).subscribe({
              next: () => {
                this.loadSubInventories();
                Swal.fire({
                  title: 'Success!',
                  text: `Decreased quantity by ${quantityToSubtract}.`,
                  icon: 'success',
                  confirmButtonText: 'OK',
                  customClass: {
                    confirmButton: 'btn btn-success'  
                  }
                });
              },
              error: (error) => {
                console.error('Error updating quantity:', error);
                Swal.fire({
                  title: 'Error!',
                  text: error?.error?.message || 'Failed to decrease quantity.',
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
      
      
      activeSubInventory(id: string): void {
        this.subInventoryService.activeSubInventory(id).subscribe({
          next: () => {
            this.loadSubInventories();
          },
          error:(error) => console.error('❌ Error:', error)
        });
      }
  
      inActiveSubInventory(id: string): void {
        this.subInventoryService.deactiveSubInventory(id).subscribe({
          next: () => {
            this.loadSubInventories();
          },
          error:(error) => console.error('❌ Error:', error)
        });
      }
  
      toggleSubInventoryStatus(subInventory: SubInventory) {
        if (subInventory.active) {
          this.inActiveSubInventory(subInventory._id);
        } else {
          this.activeSubInventory(subInventory._id); 
        }
      }
      
    
      applyFilters(): void {
        let filtered = [...this.subInventories];
    
        if (this.searchTerm) {
          const searchLower = this.searchTerm.toLowerCase();
          filtered = filtered.filter(subInventory => 
            subInventory.product.name.toLowerCase().includes(searchLower) 
          );
        }
    
        if (this.statusFilter !== 'all') {
          filtered = filtered.filter(subInventory => 
            subInventory.active === (this.statusFilter === 'active')
          );
        }
    
        filtered.sort((a, b) => {
          const direction = this.sortDirection === 'asc' ? 1 : -1;
          return a.product.name.localeCompare(b.product.name) * direction;
        });
    
        this.filteredSubInventories = [...filtered];
        this.cdr.detectChanges();
      }
    
      onSearch(): void {
        this.applyFilters();
      }
    
      onStatusFilterChange(): void {
        this.applyFilters();
      }
    
      sort(column: keyof SubInventory): void {
        if (this.sortColumn === column) {
          this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
          this.sortColumn = column;
          this.sortDirection = 'asc';
        }
        this.applyFilters();
      }
      
        // openAddModal(): void {
        //   this.userData = this.getInitialUserData();
        //   this.showAddModal = true;
        // }
      
        // openEditModal(user: User): void {
        //   this.editingUser = user;
        //   this.userData = { ...user };
        //   this.showEditModal = true;
        //   console.log("✅ Opening Edit Modal with Data:", this.userData);
        // }
      
        // onUserSaved(): void {
        //   this.loadUsers();
        //   this.showAddModal = false;
        // }
      
        // onUserUpdated(): void {
        //   this.showEditModal = false;
        //   this.loadUsers();
        // }
}
