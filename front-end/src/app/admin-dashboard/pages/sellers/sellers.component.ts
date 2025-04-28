import { Component, OnInit, OnDestroy, ChangeDetectorRef  } from '@angular/core';
import { User } from '../../../_models/user.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../_services/user.service';
import Swal from 'sweetalert2';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { firstValueFrom, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AddSellerComponent } from './add-seller/add-seller.component';
import { EditSellerComponent } from './edit-seller/edit-seller.component';

@Component({
  selector: 'app-sellers',
  imports: [CommonModule,FormsModule,RouterModule,MatIconModule,MatMenuModule,AddSellerComponent,EditSellerComponent],
  templateUrl: './sellers.component.html',
  styleUrl: './sellers.component.css'
})
export class SellersComponent implements OnInit, OnDestroy{
users: User[] =[]
    filteredUsers: User[] = [];
    loading = false;
    searchTerm: string = '';
    sortColumn: keyof User = 'firstName';
    sortDirection: 'asc' | 'desc' = 'asc';
    statusFilter: 'all' | 'active' | 'inactive' = 'all';
    showAddModal = false;
    showEditModal = false;
    editingUser?: User;
    selectedFiles: File[] = [];
    error: string | null = null;
    private destroy$ = new Subject<void>();
    userData: User = this.getInitialUserData();
    constructor(private UserService: UserService , private cdr: ChangeDetectorRef) {}
  
    ngOnInit(): void {
      this.loadUsers();
      this.subscribeToUserUpdates();
    }
    getInitialUserData(): User {
      return {
        _id: '',
        role: 'seller',
        email:'',
        password:'',
        salt:'',
        firstName:'',
        lastName:'',
        address:{city:'',state:'',street:'',zipCode:''},
        contactNo: '',
        image:[],
        isActive: true
      };
    }
    subscribeToUserUpdates(): void {
      this.UserService.onUserUpdate()
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => this.loadUsers());
    }

    ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
    }

  
    async loadUsers(): Promise<void> {
      this.loading = true;
      this.error = null;
      
      try {
        const data = await firstValueFrom(this.UserService.getUsersBasedOnRole('Seller'));
        this.users = data.map(user => ({
          ...user,
        }));
    
        this.filteredUsers = [...this.users];
    
        this.applyFilters();
        this.cdr.detectChanges();
      } catch (error) {
        console.error('❌ Error loading sellers:', error);
        this.error = 'Failed to load sellers';
      } finally {
        this.loading = false;
      }
    }
    

    get activeUsersCount(): number {
      return this.users.filter(user => user.isActive === true).length;
    }
  
    get inactiveUsersCount(): number {
      return this.users.filter(user => user.isActive === false).length;
    }
  
  
    deleteUser(id: string): void {
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.UserService.deleteUser(id).subscribe({
            next: () => {
              this.loadUsers();
              Swal.fire('Deleted!', 'seller has been deleted.', 'success');
            },
            error: (error) => {
              console.error('Error deleting seller:', error);
              Swal.fire('Error!', 'Failed to delete seller.', 'error');
            }
          });
        }
      });
    }

    activeUser(id: string): void {
      this.UserService.activeUser(id,this.userData).subscribe({
        next: () => {
          this.loadUsers();
        },
        error:(error) => console.error('❌ Error:', error)
      });
    }

    inActiveUser(id: string): void {
      this.UserService.inActiveUser(id,this.userData).subscribe({
        next: () => {
          this.loadUsers();
        },
        error:(error) => console.error('❌ Error:', error)
      });
    }

    toggleUserStatus(user: User) {
      if (user.isActive) {
        this.inActiveUser(user._id);
      } else {
        this.activeUser(user._id); 
      }
    }
    
    changeUserRole(id: string): void { 
      Swal.fire({
        title: 'Are you sure?',
        text: "You are about to change this seller's role!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, change role!',
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-secondary'  
        }
      }).then((result) => {
        if (result.isConfirmed) {
          this.UserService.changeUserRole(id, "customer").subscribe({ 
            next: () => {
              this.loadUsers();
              Swal.fire({
                title: 'Success!',
                text: `User role has been updated to customer.`,
                icon: 'success',
                confirmButtonText: 'OK',
                customClass: {
                  confirmButton: 'btn btn-success'  
                }
              });
            },
            error: (error) => {
              console.error('Error changing user role:', error);
              Swal.fire({
                title: 'Error!',
                text: error?.error?.message || 'Failed to change user role.',
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
      let filtered = [...this.users];
  
      if (this.searchTerm) {
        const searchLower = this.searchTerm.toLowerCase();
        filtered = filtered.filter(user => 
          user.firstName.toLowerCase().includes(searchLower) 
        );
      }
  
      if (this.statusFilter !== 'all') {
        filtered = filtered.filter(user => 
          user.isActive === (this.statusFilter === 'active')
        );
      }
  
      filtered.sort((a, b) => {
        const direction = this.sortDirection === 'asc' ? 1 : -1;
        return String(a[this.sortColumn]).localeCompare(String(b[this.sortColumn])) * direction;
      });
  
      this.filteredUsers = [...filtered];
      this.cdr.detectChanges();
    }
  
    onSearch(): void {
      this.applyFilters();
    }
  
    onStatusFilterChange(): void {
      this.applyFilters();
    }
  
    sort(column: keyof User): void {
      if (this.sortColumn === column) {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortColumn = column;
        this.sortDirection = 'asc';
      }
      this.applyFilters();
    }
    
      openAddModal(): void {
        this.userData = this.getInitialUserData();
        this.showAddModal = true;
      }
    
      openEditModal(user: User): void {
        this.editingUser = user;
        this.userData = { ...user };
        this.showEditModal = true;
      }
    
      onUserSaved(): void {
        this.loadUsers();
        this.showAddModal = false;
      }
    
      onUserUpdated(): void {
        this.showEditModal = false;
        this.loadUsers();
      }
}
