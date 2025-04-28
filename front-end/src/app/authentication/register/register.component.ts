import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { register } from 'src/app/_models/register';
import { AuthServiceService } from 'src/app/_services/auth-service.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, FormsModule, CommonModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})

export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage:string = "";
  constructor(
    private fb: FormBuilder,
    private userSer:AuthServiceService,
        public cookieService:CookieService,
        public router:Router

  ) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required, 
        Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/)
      ]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });

    // this.flag = this.passwordMatchValidator(this.registerForm);


  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
        confirmPassword.setErrors({ mismatch: true });
    } else {
        confirmPassword?.setErrors(null);
    }
}


  register() {
    if (this.registerForm.invalid) {
      // Handle form validation errors
      return;
    }

    const user: register = {
      firstName: this.registerForm.value.firstName,
      lastName: this.registerForm.value.lastName,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      token: "",

      // Note: Confirm Password is not included in the user object
    };

    this.userSer.register(user).subscribe(response => {
      console.log('User registered successfully:', response);
      if (this.cookieService.check("token"))
      {
        this.cookieService.delete("token")
      }
      this.cookieService.set("token", response.token);
      this.router.navigateByUrl("");

      // Handle successful registration
    }, error => {
      console.error('Registration failed:', error);
      this.errorMessage = error.error.token;
      // Handle registration failure

    });
  }
  // flag:boolean;
}