import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BranchService } from '../../../../_services/branch.service';
import { firstValueFrom } from 'rxjs';
import { Branch} from '../../../../_models/branch.model';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-edit-branch',
  imports: [FormsModule, CommonModule],
  templateUrl: './edit-branch.component.html',
  styleUrl: './edit-branch.component.css'
})
export class EditBranchComponent {
  
  @Input() show = false;
  @Input() branchData!: Branch; 

  @Output() close = new EventEmitter<void>();
  @Output() updated = new EventEmitter<void>();

  loading = false;

  constructor(
    private branchService: BranchService,
    private toastr: ToastrService,
  ) {}

  async onSubmit(): Promise<void> {
    try {
      this.loading = true;
      const updatedBranch: Branch = {
        ...this.branchData,
        branchName:this.branchData.branchName.trim(),
        location:this.branchData.location?.trim(),
      };

      await firstValueFrom(this.branchService.updateBranch(this.branchData._id, updatedBranch));

      this.toastr.success('Branch updated successfully!', 'Success');
      this.updated.emit();
      this.close.emit();
    } catch (error) {
      console.error('Error updating Branch:', error);
      this.toastr.error('Failed to update Branch. Please try again.', 'Error');
    } finally {
      this.loading = false;
    }
  }

  onClose(): void {
    this.close.emit();
  }
}
