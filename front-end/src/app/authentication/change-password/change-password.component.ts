import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';  // Import Angular Router
import { CookieService } from 'ngx-cookie-service';
import { AuthServiceService } from 'src/app/_services/auth-service.service';
import Swal from 'sweetalert2';

@Component({
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  selector: 'app-reset-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ResetPasswordComponent implements OnInit
{

  resetPasswordForm: FormGroup;
  token: string = "";
  email: string = "";
  errorMessage: string = ""; 
  constructor(
    private formBuilder: FormBuilder,
    private authSer: AuthServiceService,
    private router: Router  ,
    private cookieSer:CookieService
  ) { 
    this.resetPasswordForm = new FormGroup({
      newPassword: new FormControl("", [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/)]),
      confirmPassword: new FormControl("", [Validators.required])
    }, {validators: this.passwordMatchValidator}
  );
  }

  ngOnInit(): void {
    this.token = this.cookieSer.get("passwordToken")
    this.authSer.decodeToken(this.token).subscribe({
      next: (response) => {
        this.email = response.email;
      },
      error: (error) => {
        console.log(error);     
      }
    })
  }




  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const newPassword = control.get('newPassword')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    if (newPassword !== confirmPassword) {
        control.get('confirmPassword')?.setErrors({ mismatch: true });
        return { 'mismatch': true };
    } else {
        return null;
    }
}




  resetPassword(): void {
    if (this.resetPasswordForm.valid) {
        console.log(this.resetPasswordForm.valid);
        const newPassword = this.resetPasswordForm.get('newPassword')?.value;

        console.log(this.token)
        console.log(this.email)
        console.log(newPassword)

        this.authSer.resetPassword(this.email, this.token, newPassword).subscribe({
            next: (response) => {
                Swal.fire({
                    icon: 'success',
                    title: 'Password Reset Successful',
                    text: 'Your password has been reset successfully.',
                }).then(() => {
                    this.router.navigate(['/user/login']);
                    this.cookieSer.delete("passwordToken");
                    
                });
            },
            error: (error) => {
                this.errorMessage = 'An error occurred while resetting your password. Please try again later.';
                if (error.status === 401) { // Unauthorized error, indicating token expiration
                    this.errorMessage = 'Your password reset link has expired. Please request a new password reset email.';
                } else if (error.status === 400) { // Bad Request error, indicating other validation errors
                    this.errorMessage = 'Invalid request. Please ensure the passwords meet the requirements and try again.';
                }
                Swal.fire({
                    icon: 'error',
                    title: 'Password Reset Failed',
                    text: this.errorMessage,
                });
            }
        });
    }
}
}