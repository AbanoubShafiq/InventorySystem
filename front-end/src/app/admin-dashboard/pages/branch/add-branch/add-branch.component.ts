import { Component, Input, Output, EventEmitter,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BranchService } from '../../../../_services/branch.service';
import { firstValueFrom } from 'rxjs';
import { Branch} from '../../../../_models/branch.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-branch',
  imports: [FormsModule,CommonModule],
  templateUrl: './add-branch.component.html',
  styleUrl: './add-branch.component.css'
})
export class AddBranchComponent {
  @Input() show = false;
    @Input() branchData: Branch ={
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
    @Output() close = new EventEmitter<void>();
    @Output() saved = new EventEmitter<void>();
  
    loading = false;
    emailExists = false;
  
  
    constructor(private branchService: BranchService , private toastr: ToastrService) {}
     
    async onSubmit(): Promise<void> {
      try {
        this.loading = true;
        const branchData:Branch = {
        _id:this.branchData._id,
        branchName:this.branchData.branchName.trim(),
        location:this.branchData.location?.trim(),
        contactNumber: this.branchData.contactNumber,
        type:  this.branchData.type,
        isActive: this.branchData.isActive,
        createdAt: this.branchData.createdAt,
        updatedAt: this.branchData.updatedAt,
        showSubSubMenu:this.branchData.showSubSubMenu

        };
  
        await firstValueFrom(this.branchService.createBranch(this.branchData));
        this.toastr.success('Branch added successfully!', 'Success');
        this.saved.emit();
        this.close.emit();
      } catch (error) {
        console.error('Error adding Branch:', error);
        this.toastr.error('Failed to add Branch. Please try again.', 'Error');
      } finally {
        this.loading = false;
      }
    }
  
    onClose(): void {
      this.close.emit();
    }
}
