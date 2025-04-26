import { Component, Input, Output, EventEmitter,OnInit } from '@angular/core';
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
  selector: 'app-add-cashier',
  imports: [FormsModule,CommonModule,UploadComponent],
  templateUrl: './add-cashier.component.html',
  styleUrl: './add-cashier.component.css'
})
export class AddCashierComponent {
  branches:Branch[]=[];
  @Input() show = false;
    @Input() userData: User ={
      _id: '',
      role: 'cashier',
      email:'',
      password:'',
      salt:'',
      firstName:'',
      lastName:'',
      branch:{_id:'',branchName:''},
      contactNo: '',
      image:[],
      isActive: false
    };
    @Output() close = new EventEmitter<void>();
    @Output() saved = new EventEmitter<void>();
  
    loading = false;
    emailExists = false;
  
  
    constructor(private userService: UserService , private toastr: ToastrService,private branchService:BranchService) {}
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

    async onEmailChange(): Promise<void> {
      if (!this.userData.email.trim()) {
        this.emailExists = false;
        return;
      }
    
      try {
        const exists = await firstValueFrom(this.userService.getUserByEmail(this.userData.email));
        this.emailExists = !!exists;
      } catch (error) {
        console.error('Error checking email:', error);
        this.emailExists = false;
      }
    }
    
    
    async onSubmit(): Promise<void> {
      try {
        this.loading = true;
        const userData:User = {
        _id:this.userData._id,
        role:this.userData.role,
        email:this.userData.email,
        password:this.userData.password,
        salt: this.userData.salt,
        branch:this.userData.branch,
        firstName:this.userData.firstName.trim(),
        lastName:this.userData.lastName.trim(),
        contactNo: this.userData.contactNo,
        image:  this.userData.image,
        isActive: this.userData.isActive
        };
  
        await firstValueFrom(this.userService.createUser(this.userData));
        this.toastr.success('user added successfully!', 'Success');
        this.saved.emit();
        this.close.emit();
      } catch (error) {
        console.error('Error adding user:', error);
        this.toastr.error('Failed to add user. Please try again.', 'Error');
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
