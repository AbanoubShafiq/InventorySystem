import { Component, OnInit, OnDestroy, ChangeDetectorRef  } from '@angular/core';
import { Complaint } from '../../../_models/contact.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ContactService } from '../../../_services/contact.service';
import Swal from 'sweetalert2';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { firstValueFrom, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-contact',
  imports: [CommonModule,FormsModule,RouterModule,MatIconModule,MatMenuModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent implements OnInit, OnDestroy {
complaints: Complaint[] =[]
    filteredComplaints: Complaint[] = [];
    loading = false;
    searchTerm: string = '';
    sortColumn: keyof Complaint = 'createdAt';
    sortDirection: 'asc' | 'desc' = 'asc';
    statusFilter: 'all' |'Pending' | 'In Progress' | 'Resolved' | 'Rejected' = 'all';
    showAddModal = false;
    showEditModal = false;
    editingComplaint?: Complaint;
    selectedFiles: File[] = [];
    error: string | null = null;
    private destroy$ = new Subject<void>();
    complaintData: Complaint = this.getInitialComplaintData();
    constructor(private contactService: ContactService , private cdr: ChangeDetectorRef) {}
  
    ngOnInit(): void {
      this.loadComplaints();
      this.subscribeToComplaintUpdates();
    }
    getInitialComplaintData(): Complaint {
      return {
        _id: '',
        user: {_id:'',firstName:'',lastName:'',email:''},
        email: '',
        subject: '',
        description: '',
        status: 'Pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }
    subscribeToComplaintUpdates(): void {
      this.contactService.onComplaintUpdate()
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => this.loadComplaints());
    }

    ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
    }

  
    async loadComplaints(): Promise<void> {
      this.loading = true;
      this.error = null;
      
      try {
        const data = await firstValueFrom(this.contactService.getAllComplaints());
        this.complaints = [...data]
    
        this.filteredComplaints = [...this.complaints];
    
        this.applyFilters();
        this.cdr.detectChanges();
      } catch (error) {
        console.error('❌ Error loading Complaints:', error);
        this.error = 'Failed to load Complaints';
      } finally {
        this.loading = false;
        this.cdr.detectChanges();
      }
    }
    

    get pendingComplaintsCount(): number {
      return this.complaints.filter(complaint => complaint.status === 'Pending').length;
    }
    get progressComplaintsCount(): number {
      return this.complaints.filter(complaint => complaint.status === 'In Progress').length;
    }
    get resolvedComplaintsCount(): number {
      return this.complaints.filter(complaint => complaint.status === 'Resolved').length;
    }
    get rejectedComplaintsCount(): number {
      return this.complaints.filter(complaint => complaint.status === 'Rejected').length;
    }
  
    deleteComplaint(id: string): void {
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.contactService.deleteComplaint(id).subscribe({
            next: () => {
              this.loadComplaints();
              Swal.fire('Deleted!', 'Complaint has been deleted.', 'success');
            },
            error: (error) => {
              console.error('Error deleting Complaint:', error);
              Swal.fire('Error!', 'Failed to delete Complaint.', 'error');
            }
          });
        }
      });
    }

    changeStatus(id: string, newStatus: 'Pending' | 'In Progress' | 'Resolved' | 'Rejected'): void {
      this.contactService.changeComplaintStatus(id, newStatus).subscribe({
        next: () => {
          console.log(`✅ Status changed to: ${newStatus}`);
          this.loadComplaints();
        },
        error:(error) => console.error('❌ Error:', error)
      });
    } 
  
    applyFilters(): void {
      let filtered = [...this.complaints];
  
      if (this.searchTerm) {
        const searchLower = this.searchTerm.toLowerCase();
        filtered = filtered.filter(complaint => 
          new Date(complaint.createdAt).toLocaleDateString().toLowerCase().includes(searchLower)
        );
      }
  
      if (this.statusFilter !== 'all') {
        filtered = filtered.filter(complaint => complaint.status === this.statusFilter);
      }
      
      filtered.sort((a, b) => {
        const direction = this.sortDirection === 'asc' ? 1 : -1;
        return String(a[this.sortColumn]).localeCompare(String(b[this.sortColumn])) * direction;
      });
  
      this.filteredComplaints = [...filtered];
      this.cdr.detectChanges();
    }
  
    onSearch(): void {
      this.applyFilters();
    }
  
    onStatusFilterChange(): void {
      this.applyFilters();
    }
  
    sort(column: keyof Complaint): void {
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
