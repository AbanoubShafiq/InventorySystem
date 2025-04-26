import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../../_services/user.service';
import { firstValueFrom } from 'rxjs';
import { User } from '../../../../_models/user.model';
import { ToastrService } from 'ngx-toastr';
import { UploadComponent } from 'src/app/upload/upload.component';
import { Branch } from 'src/app/_models/branch.model';
import { BranchService } from 'src/app/_services/branch.service';

@Component({
  selector: 'app-edit-cashier',
  imports: [FormsModule, CommonModule, UploadComponent],
  templateUrl: './edit-cashier.component.html',
  styleUrl: './edit-cashier.component.css'
})
export class EditCashierComponent {
  branches:Branch[]=[]
  @Input() show = false;
    @Input() userData!: User; 
  
    @Output() close = new EventEmitter<void>();
    @Output() updated = new EventEmitter<void>();
  
    loading = false;

    constructor(
      private userService: UserService,
      private toastr: ToastrService,
      private branchService:BranchService
    ) {}

    ngOnInit(): void {
      this.loadBranches();
    }

    loadBranches(): void {
      this.branchService.getBranchesByActive().subscribe({
        next: (response) => {
          this.branches = response;
        },
        error: (error) => console.error('❌ Error fetching branches:', error)
      });
    }

    onImagesUploaded(imageUrls: string[]) {
      this.userData.image = imageUrls;
    }    
  
    async onSubmit(): Promise<void> {
      try {
        this.loading = true;
        const updatedUser: User = {
          ...this.userData,
          firstName: this.userData.firstName.trim(),
          lastName: this.userData.lastName.trim(),
        };

        await firstValueFrom(this.userService.updateUser(this.userData._id, updatedUser));
  
        this.toastr.success('User updated successfully!', 'Success');
        this.updated.emit();
        this.close.emit();
      } catch (error) {
        console.error('Error updating User:', error);
        this.toastr.error('Failed to update User. Please try again.', 'Error');
      } finally {
        this.loading = false;
      }
    }
  
    onClose(): void {
      this.close.emit();
    }

    removeImage() {
      this.userData.image=[];
    }
}
