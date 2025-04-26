import { Component, OnInit, OnDestroy, ChangeDetectorRef  } from '@angular/core';
import { DistReq } from '../../../_models/dist-req.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DistReqService } from '../../../_services/dist-req.service';
import Swal from 'sweetalert2';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { firstValueFrom, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ProductService } from 'src/app/_services/product.service';
import { BranchService } from 'src/app/_services/branch.service';

@Component({
  selector: 'app-dist-req',
  imports: [CommonModule,FormsModule,RouterModule,MatIconModule,MatMenuModule],
  templateUrl: './dist-req.component.html',
  styleUrl: './dist-req.component.css'
})
export class DistReqComponent implements OnInit, OnDestroy{
  distReqs: DistReq[] =[]
      filteredDistReqs: DistReq[] = [];
      loading = false;
      searchTerm: string = '';
      sortColumn: keyof DistReq = 'createdAt';
      sortDirection: 'asc' | 'desc' = 'asc';
      statusFilter: 'all' | 'pending' | 'approved' | 'rejected' = 'all';
      showAddModal = false;
      showEditModal = false;
      editingDistReq?: DistReq;
      selectedFiles: File[] = [];
      error: string | null = null;
      private destroy$ = new Subject<void>();
      distReqData: DistReq = this.getInitialDistReqData();
      constructor(private distReqService: DistReqService , private cdr: ChangeDetectorRef,
        private productService:ProductService,private branchService:BranchService
      ) {}
    
      ngOnInit(): void {
        this.loadDistReqs();
        this.subscribeToDistReqUpdates();
      }
      getInitialDistReqData(): DistReq {
        return {
            _id: '',
            mainInventory: {product: ''},
            branchManager: {firstName: '',lastName: '',branch: ''},
            productDetails: {name:'',images:[]},
            branchDetails:{branchName:''},
            requestedQuantity: 0,
            status: 'pending',
            message: '',
            createdAt: '',
            updatedAt: '',
        }
        };
      subscribeToDistReqUpdates(): void {
        this.distReqService.onDistReqUpdate()
          .pipe(takeUntil(this.destroy$))
          .subscribe(() => this.loadDistReqs());
      }
  
      ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
      }
  
    
      async loadDistReqs(): Promise<void> {
        this.loading = true;
        this.error = null;
        
        try {
          const data = await firstValueFrom(this.distReqService.getAllDistributionReqs());
          this.distReqs = [...data]
      
          this.filteredDistReqs = [...this.distReqs];
          for (const item of this.distReqs) {
            if (item.mainInventory.product) {
              this.productService.getProductById(item.mainInventory.product).subscribe({
                next: (product:any) => {
                  item.productDetails = product;
                  this.cdr.detectChanges();
                },
                error: (error) => console.error('❌ Error fetching product:', error)
              });
            }
          }
          for (const item of this.distReqs) {
            if (item.branchManager.branch) {
              this.branchService.getBranchById(item.branchManager.branch).subscribe({
                next: (product:any) => {
                  item.branchDetails = product;
                  this.cdr.detectChanges();
                },
                error: (error) => console.error('❌ Error fetching product:', error)
              });
            }
          }
        
      
          this.applyFilters();
          this.cdr.detectChanges();
        } catch (error) {
          console.error('❌ Error loading DistReqs:', error);
          this.error = 'Failed to load DistReqs';
        } finally {
          this.loading = false;
          this.cdr.detectChanges();
        }
      }
      
  
      get pendingDistReqCount(): number {
        return this.distReqs.filter(distReq => distReq.status === 'pending').length;
      }
      get approveDistReqCount(): number {
        return this.distReqs.filter(distReq => distReq.status === 'approved').length;
      }
      get rejectDistReqCount(): number {
        return this.distReqs.filter(distReq => distReq.status === 'rejected').length;
      }
    
    
      deleteDistReq(id: string): void {
        Swal.fire({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, delete it!',
          customClass: {
            confirmButton: 'btn btn-primary',
            cancelButton:'btn btn-secondary'  
          }
        }).then((result) => {
          if (result.isConfirmed) {
            this.distReqService.deleteDistReq(id).subscribe({
              next: () => {
                this.loadDistReqs();
                Swal.fire({
                  title: 'Success!',
                  text: `DistReq has been deleted.`,
                  icon: 'success',
                  confirmButtonText: 'OK',
                  customClass: {
                    confirmButton: 'btn btn-success'  
                  }
                });
              },
              error: (error) => {
                console.error('Error deleting DistReq:', error);
                Swal.fire({
                  title: 'Error!',
                  text: error?.error?.message || 'Failed to delete DistReq.',
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
  
  
      changeDistReqStatus(id: string, status: string): void {
        Swal.fire({
          title: 'Change Distribution Request Status',
          input: 'text',
          inputLabel: 'Enter a message for this status change',
          inputPlaceholder: 'Type your message here...',
          showCancelButton: true,
          confirmButtonText: 'Change Status',
          cancelButtonText: 'Cancel',
          customClass: {
            confirmButton: 'btn btn-primary',
            cancelButton: 'btn btn-secondary',
          },
          preConfirm: (message) => {
            if (!message.trim()) {
              Swal.showValidationMessage('Please enter a valid message');
            }
            return message.trim();
          }
        }).then((result) => {
          if (result.isConfirmed) {
            const message = result.value;
            this.distReqService.changeDistReqStatus(id, status, message).subscribe({
              next: () => {
                this.loadDistReqs();
                Swal.fire({
                  title: 'Success!',
                  text: `Distribution request status changed to "${status}" with message: "${message}".`,
                  icon: 'success',
                  confirmButtonText: 'OK',
                  customClass: {
                    confirmButton: 'btn btn-success'
                  }
                });
              },
              error: (error) => {
                console.error('Error changing status:', error);
                Swal.fire({
                  title: 'Error!',
                  text: error?.error?.message || 'Failed to change request status.',
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
    
    
  
      applyFilters(): void {
        let filtered = [...this.distReqs];
    
        if (this.searchTerm) {
          const searchLower = this.searchTerm.toLowerCase();
          filtered = filtered.filter(distReq => 
            distReq.branchManager.firstName.toLowerCase().includes(searchLower) 
          );
        }
    
        if (this.statusFilter !== 'all') {
          filtered = filtered.filter(distReq => 
            distReq.status === this.statusFilter
          );
        }
    
        filtered.sort((a, b) => {
          const direction = this.sortDirection === 'asc' ? 1 : -1;
          return String(a[this.sortColumn]).localeCompare(String(b[this.sortColumn])) * direction;
        });
    
        this.filteredDistReqs = [...filtered];
        this.cdr.detectChanges();
      }
    
      onSearch(): void {
        this.applyFilters();
      }
    
      onStatusFilterChange(): void {
        this.applyFilters();
      }
    
      sort(column: keyof DistReq): void {
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
