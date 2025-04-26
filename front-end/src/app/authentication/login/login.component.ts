import { Component, OnInit } from '@angular/core';
import { Login } from '../../_models/login';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'; // Import FormsModule
// import { UserServiceService } from '../../_services/user.service';
import { CookieService } from 'ngx-cookie-service';
import { CommonModule, JsonPipe } from '@angular/common';
import { AuthServiceService } from 'src/app/_services/auth-service.service';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  imports: [FormsModule, JsonPipe, CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [CookieService],
})
export class LoginComponent 
{
  loginFrom:FormGroup;
  loginFailed: boolean = false; 
  constructor(
    public loginSer:AuthServiceService,
    public cookieService:CookieService,
    public router:Router
  ){


    this.loginFrom = new FormGroup({
      email:new FormControl("", [Validators.required, Validators.email]),
      password: new FormControl("", [
        Validators.required, 
        Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/)
      ])      
      })
      this.loginForm = new Login(this.validate("email")?.value, this.validate("password")?.value, "");

  }

  loginForm:Login;

  loginData:Login = new Login("", "", "");

  Login() {


    console.log(this.validate("email")?.value)

    if (this.loginFrom.valid) {
      const email = this.loginFrom.get('email')?.value;
      const password = this.loginFrom.get('password')?.value;
  
      console.log("Email:", email);
      console.log("Password:", password);
  
      this.loginData = new Login(email, password, "");

      this.loginSer.login(this.loginData).subscribe({
        next: (data) => {
          if (this.cookieService.check("token"))
          {
            this.cookieService.delete("token")
          }
          this.cookieService.set("token", data.token);
          console.log(data.token)
          this.router.navigateByUrl("");
          this.loginFailed = false;
        },
        error: (error) => {
          if (error.error.message == "Please contact the admin for assistance.")
          {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: error.error.message,
            });
            this.loginFailed = false;
          }
          else 
          {
            console.log(error.error.message)
            console.log(error)
            this.loginFailed = true;
          }
        }
      })


    } else {
      console.log("Form is invalid");
    }
  }
  

  validate(input: string) {
    return this.loginFrom.get(input);
  }


}