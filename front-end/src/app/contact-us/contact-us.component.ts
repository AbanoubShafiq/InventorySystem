import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactService } from '../_services/contact.service';
import { ContactCusService } from '../_services/contact-cus.service';
import { AuthServiceService } from '../_services/auth-service.service';
import { CookieService } from 'ngx-cookie-service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  imports: [CommonModule, ReactiveFormsModule],
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit
{

  private claims: any;
  private userEmail: string = '';
  // private fName: string = '';
  // private lName: string = '';
  

  contactForm: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private contactCusService: ContactCusService,
    private autuSer:AuthServiceService,
    private cookieSer:CookieService,
    private router:Router
  ) {
    this.contactForm = this.fb.group({
      // firstName: [this.fName, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      // lastName: [this.lName, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: [this.userEmail, [Validators.required, Validators.email]],
      subject: [this.userEmail, [Validators.required, Validators.minLength(10)]],
      description: ['', [Validators.required, Validators.minLength(20)]]
    });
  }


  ngOnInit(): void {
    if (this.autuSer.isAuthenticated()) {
    this.autuSer.decodeToken(this.getToken()).subscribe({
      next: (data) => {
        this.claims = data;  // Now claims is guaranteed to have data
        console.log(this.claims);
  
          console.log(this.claims.email);
          
          this.autuSer.getUserDataByEmail(this.claims.email).subscribe({
            next: (user) => {
              this.userEmail = user.email;
              // this.fName = user.firstName;
              // this.lName = user.lastName;
              
              this.contactForm.patchValue({
                // firstName: this.fName,
                // lastName: this.lName,
                email: this.userEmail
              });
            },
            error: (err) => {
              console.error('Error fetching user', err);
            }
          });
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  }


  getToken()
  {
    return this.cookieSer.get('token')
  }

  onSubmit() {
    if (this.contactForm.valid) {
      const formData = this.contactForm.value;
      if (this.autuSer.isAuthenticated())
      {
        formData.user = this.claims.sub;
      }

      console.log(formData);

      this.contactCusService.submitComplaint(formData).subscribe(
        (response) => {
          console.log('Response from server:', response);
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Your complaint has been saved",
            showConfirmButton: false,
            timer: 1500
          });
          this.contactForm.reset();
          this.router.navigateByUrl("");

        },
        (error) => {
          console.error('Error sending message:', error);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
          });
        }
      );
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please fill out all fields correctly!",
      });
    }
  }

  // get firstName() {
  //   return this.contactForm.get('firstName');
  // }

  // get lastName() {
  //   return this.contactForm.get('lastName');
  // }

  get email() {
    return this.contactForm.get('email');
  }

  get description() {
    return this.contactForm.get('description');
  }

  get subject ()
  {
    return this.contactForm.get('subject');
  }

}