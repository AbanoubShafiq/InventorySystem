import { Component, Input, Output, EventEmitter,OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../../_services/user.service';
import { firstValueFrom } from 'rxjs';
import { User } from '../../../../_models/user.model';
import { ToastrService } from 'ngx-toastr';
import { UploadComponent } from 'src/app/upload/upload.component';

@Component({
  selector: 'app-add-user',
  imports: [FormsModule,CommonModule,UploadComponent],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.css'
})
export class AddUserComponent{
   private toastr = inject(ToastrService);
    @Input() show = false;
    @Input() userData: User ={
        _id: '',
        role: 'customer',
        email:'',
        password:'',
        salt:'',
        firstName:'',
        lastName:'',
        address:{city:'',state:'',street:'',zipCode:''},
        contactNo: '',
        image:[],
        isActive: false 
    };
    @Output() close = new EventEmitter<void>();
    @Output() saved = new EventEmitter<void>();
  
    loading = false;
    emailExists = false;
  
  
    constructor(private userService: UserService ) {}
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
        firstName:this.userData.firstName.trim(),
        lastName:this.userData.lastName.trim(),
        address: {
          street: (this.userData.address || {}).street?.trim() || '',
          city: (this.userData.address || {}).city?.trim() || '',
          state: (this.userData.address || {}).state?.trim() || '',
          zipCode: (this.userData.address || {}).zipCode?.trim() || ''
        },
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
