import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { AuthServiceService } from 'src/app/_services/auth-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-request-change-password',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './request-change-password.component.html',
  styleUrl: './request-change-password.component.css'
})
export class RequestChangePasswordComponent 
{
  requestPasswordToChange: FormGroup;
  requestFaild:boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private authSer:AuthServiceService,
    private cookieSer:CookieService
  ) { 
    this.requestPasswordToChange = new FormGroup({
      email: new FormControl("", [Validators.required,Validators.email])

    })
  }

  requestPasswordReset(): void {
    if (this.requestPasswordToChange.valid) {
      const email = this.requestPasswordToChange.get('email')?.value;
      if (email) {
        this.authSer.requestChangePassword(email).subscribe(
          response => {
            this.cookieSer.set("passwordToken", response.message)
            console.log('Password reset requested successfully:', response);
            this.requestFaild = false;
            Swal.fire({
              icon: 'success',
              title: 'Password Reset Requested',
              text: 'A password reset link has been sent to your email address.',
            });
          },
          error => {
            this.requestFaild = true;
            console.error('Error requesting password reset:', error);
            if (error.status === 400) {
              Swal.fire({
                icon: 'error',
                title: 'User Not Found',
                text: 'No user found with that email address. Please check and try again.',
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Request Failed',
                text: 'An error occurred while requesting the password reset. Please try again later.',
              });
            }
          }
        );
      } else {
        console.log('Email is null or undefined');
      }
    } else {
      console.log('Form is invalid');
    }
  }
  


}
