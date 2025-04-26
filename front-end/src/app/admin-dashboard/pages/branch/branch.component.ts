import { Component, OnInit, OnDestroy, ChangeDetectorRef  } from '@angular/core';
import { Branch } from '../../../_models/branch.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BranchService } from '../../../_services/branch.service';
import Swal from 'sweetalert2';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { firstValueFrom, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AddBranchComponent } from './add-branch/add-branch.component';
import { EditBranchComponent } from './edit-branch/edit-branch.component';

@Component({
  selector: 'app-branch',
  imports: [CommonModule,FormsModule,RouterModule,MatIconModule,MatMenuModule,AddBranchComponent,EditBranchComponent],
  templateUrl: './branch.component.html',
  styleUrl: './branch.component.css'
})
export class BranchComponent implements OnInit, OnDestroy{
    branches: Branch[] =[]
      filteredBranches: Branch[] = [];
      loading = false;
      searchTerm: string = '';
      sortColumn: keyof Branch = 'branchName';
      sortDirection: 'asc' | 'desc' = 'asc';
      statusFilter: 'all' | 'active' | 'inactive' = 'all';
      showAddModal = false;
      showEditModal = false;
      editingBranch?: Branch;
      selectedFiles: File[] = [];
      error: string | null = null;
      private destroy$ = new Subject<void>();
      branchData: Branch = this.getInitialBranchData();
      constructor(private branchService: BranchService , private cdr: ChangeDetectorRef) {}
    
      ngOnInit(): void {
        this.loadBranches();
        this.subscribeToBranchUpdates();
      }
      getInitialBranchData(): Branch {
        return {
          _id: '',
          branchName: '',
          location: '',
          contactNumber: '',
          type: 'offline',
          isActive: true,
          createdAt:new Date(),
          updatedAt:new Date(),
          showSubSubMenu:false
        };
      }
      subscribeToBranchUpdates(): void {
        this.branchService.onBranchUpdate()
          .pipe(takeUntil(this.destroy$))
          .subscribe(() => this.loadBranches());
      }
  
      ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
      }
  
    
      async loadBranches(): Promise<void> {
        this.loading = true;
        this.error = null;
        
        try {
          const data = await firstValueFrom(this.branchService.getAllBranches());
          this.branches = [...data]
      
          this.filteredBranches = [...this.branches];
      
          this.applyFilters();
          this.cdr.detectChanges();
        } catch (error) {
          console.error('❌ Error loading Branches:', error);
          this.error = 'Failed to load Branches';
        } finally {
          this.loading = false;
          this.cdr.detectChanges();
        }
      }
      
  
      get activeBranchesCount(): number {
        return this.branches.filter(branch => branch.isActive === true).length;
      }
    
      get inactiveBranchesCount(): number {
        return this.branches.filter(branch => branch.isActive === false).length;
      }
    
    
      deleteBranch(id: string): void {
        Swal.fire({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
          if (result.isConfirmed) {
            this.branchService.deleteBranch(id).subscribe({
              next: () => {
                this.loadBranches();
                Swal.fire('Deleted!', 'Branch has been deleted.', 'success');
              },
              error: (error) => {
                console.error('Error deleting Branch:', error);
                Swal.fire('Error!', 'Failed to delete Branch.', 'error');
              }
            });
          }
        });
      }
  
      toggleBranchStatus(id:string) {
        this.branchService.toggleStatusBranch(id).subscribe({
            next: () => {
              this.loadBranches();
            },
            error:(error) => console.error('❌ Error:', error)
          });
      }
      
    
      applyFilters(): void {
        let filtered = [...this.branches];
    
        if (this.searchTerm) {
          const searchLower = this.searchTerm.toLowerCase();
          filtered = filtered.filter(branch => 
            branch.branchName.toLowerCase().includes(searchLower) 
          );
        }
    
        if (this.statusFilter !== 'all') {
          filtered = filtered.filter(branch => 
            branch.isActive === (this.statusFilter === 'active')
          );
        }
    
        filtered.sort((a, b) => {
          const direction = this.sortDirection === 'asc' ? 1 : -1;
          return String(a[this.sortColumn]).localeCompare(String(b[this.sortColumn])) * direction;
        });
    
        this.filteredBranches = [...filtered];
        this.cdr.detectChanges();
      }
    
      onSearch(): void {
        this.applyFilters();
      }
    
      onStatusFilterChange(): void {
        this.applyFilters();
      }
    
      sort(column: keyof Branch): void {
        if (this.sortColumn === column) {
          this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
          this.sortColumn = column;
          this.sortDirection = 'asc';
        }
        this.applyFilters();
      }
      
        openAddModal(): void {
          this.branchData = this.getInitialBranchData();
          this.showAddModal = true;
        }
      
        openEditModal(branch: Branch): void {
          this.editingBranch = branch;
          this.branchData = { ...branch };
          this.showEditModal = true;
        }
      
        onBranchSaved(): void {
          this.loadBranches();
          this.showAddModal = false;
        }
      
        onBranchUpdated(): void {
          this.showEditModal = false;
          this.loadBranches();
        }
}
