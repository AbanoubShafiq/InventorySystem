// import { Component } from '@angular/core';
// import { User } from '../../../_models/user.model';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { RouterModule } from '@angular/router';
// import { UserService } from '../../../_services/user.service';
// import Swal from 'sweetalert2';
// import { MatIconModule } from '@angular/material/icon';
// import { MatMenuModule } from '@angular/material/menu';
// @Component({
//   selector: 'app-review',
//   imports: [CommonModule,FormsModule,RouterModule,MatIconModule,MatMenuModule],
//   templateUrl: './review.component.html',
//   styleUrl: './review.component.css'
// })
// export class ReviewComponent {
//   users: User[] = [
//       {_id:1, name: 'Talia Keyes', email: 'tkeyes@example.org', address: '789 Oak Ave, Lakeview', phone: '+1-456-789-0123', gender: 'female', status: true, initials: 'TK' },
//       {_id:1, name: 'Sophia James', email: 'sjames@abc.net.au', address: '404 Spruce Dr, Willowfield', phone: '+1-890-123-4567', gender: 'female', status: true, initials: 'SJ' },
//       {_id:1, name: 'Olivia Barnes', email: 'obarnes@xyz.com', address: '202 Birch Ln, Greenfield', phone: '+1-678-901-2345', gender: 'female', status: false, initials: 'OB' },
//       {_id:1, name: 'Noah Carter', email: 'ncarter5@example.org', address: '303 Cedar Blvd, Rivertown', phone: '+1-789-012-3456', gender: 'female', status: true, initials: 'NC' },
//       {_id:1, name: 'Mason King', email: 'mking7@xyz.com', address: '505 Walnut St, Bridgewater', phone: '+1-901-234-5678', gender: 'female', status: false, initials: 'MK' },
//       {_id:1, name: 'Lucas Harper', email: 'lharper@abc.net.au', address: '707 Chestnut Ct, Highland', phone: '+1-123-456-7890', gender: 'male', status: true, initials: 'LH' },
//       {_id:1, name: 'Liam Grayson', email: 'lgrayson3@abc.net.au', address: '101 Pine Rd, Brookfield', phone: '+1-567-890-1234', gender: 'male', status: true, initials: 'LG' },
//       {_id:1, name: 'Jules Windsor', email: 'jwindsor@xyz.com', address: '456 Maple St, Centerville', phone: '+1-345-678-9012', gender: 'male', status: false, initials: 'JW' },
//       {_id:1, name: 'Galen Slixby', email: 'gslixby@abc.net.au', address: '123 Elm St, Springfield', phone: '+1-234-567-8901', gender: 'female', status: true, initials: 'GS' },
//       {_id:1, name: 'Ella Fisher', email: 'efisher@example.org', address: '606 Ash Ave, Sunnyvale', phone: '+1-012-345-6789', gender: 'male', status: false, initials: 'EF' },
//     ];
//       filteredUsers: User[] = [];
//       loading = false;
//       searchTerm: string = '';
//       sortColumn: keyof User = 'name';
//       sortDirection: 'asc' | 'desc' = 'asc';
//       statusFilter: 'all' | 'active' | 'inactive' = 'all';
    
//       constructor(private UserService: UserService) {}
    
//       ngOnInit(): void {
//         this.filteredUsers = [...this.users]; // استخدم البيانات المحلية
//     this.applyFilters();
//       }
    
//       loadUsers(): void {
//         this.loading = true;
//         this.UserService.getAllUsers().subscribe({
//           next: (data: User[]) => {
//             this.users = data;
//             this.filteredUsers = [...data];
//             this.applyFilters();
//             this.loading = false;
//           },
//           error: (error) => {
//             console.error('Error loading Users:', error);
//             this.loading = false;
//           }
//         });
//       }
    
//       deleteUser(id: number): void {
//         Swal.fire({
//           title: 'Are you sure?',
//           text: "You won't be able to revert this!",
//           icon: 'warning',
//           showCancelButton: true,
//           confirmButtonText: 'Yes, delete it!'
//         }).then((result) => {
//           if (result.isConfirmed) {
//             this.UserService.deleteUser(id).subscribe({
//               next: () => {
//                 this.loadUsers();
//                 Swal.fire('Deleted!', 'user has been deleted.', 'success');
//               },
//               error: (error) => {
//                 console.error('Error deleting user:', error);
//                 Swal.fire('Error!', 'Failed to delete user.', 'error');
//               }
//             });
//           }
//         });
//       }
    
//       applyFilters(): void {
//         let filtered = [...this.users];
    
//         if (this.searchTerm) {
//           filtered = filtered.filter(user => 
//             user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) 
//           );
//         }
    
//         if (this.statusFilter !== 'all') {
//           filtered = filtered.filter(user => 
//             user.status === (this.statusFilter === 'active')
//           );
//         }
    
//         filtered.sort((a, b) => {
//           const direction = this.sortDirection === 'asc' ? 1 : -1;
//           // if (typeof a[this.sortColumn] === 'number') {
//           //   return ((a[this.sortColumn] as number) - (b[this.sortColumn] as number)) * direction;
//           // }
//           return String(a[this.sortColumn]).localeCompare(String(b[this.sortColumn])) * direction;
//         });
    
//         this.filteredUsers = filtered;
//       }
    
//       onSearch(): void {
//         this.applyFilters();
//       }
    
//       onStatusFilterChange(): void {
//         this.applyFilters();
//       }
    
//       sort(column: keyof User): void {
//         if (this.sortColumn === column) {
//           this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
//         } else {
//           this.sortColumn = column;
//           this.sortDirection = 'asc';
//         }
//         this.applyFilters();
//       }
// }
