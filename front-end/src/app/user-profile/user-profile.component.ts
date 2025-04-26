import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from '../_services/auth-service.service';
import { CookieService } from 'ngx-cookie-service';
import { User } from '../_models/user.model';
//import { userProfile } from '../_models/userProfile.model';
import { LocationServicesService } from '../_services/location-services.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, JsonPipe } from '@angular/common';
import { register } from '../_models/register';
import { userProfile } from '../_models/userProfile.model';
import { Order } from '../_models/order.module';
import { OrderService } from '../_services/order.service';
import { UploadService } from '../_services/upload.service';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import Swal from 'sweetalert2';
import { ContactService } from '../_services/contact.service';
import { Complaint } from '../_models/contact.model';

@Component({
  selector: 'app-user-profile',
  imports: [ReactiveFormsModule, CommonModule, JsonPipe, RouterLink, RouterOutlet],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit
{

  token:any;
  userData:any;
  id:any;
  governorates: any[] = [];
  cities: any[] = [];

  // user profile 
  userProfileForm:FormGroup;

  // user Order 
  userOrder:Order[] = [];

  constructor(
    private authSer: AuthServiceService,
    private cookieServices:CookieService,
    private locationSer:LocationServicesService,
    private uploadSer:UploadService,
    private router:Router
  ) {

    this.userProfileForm = new FormGroup({
      firstName: new FormControl("", Validators.required),
      lastName: new FormControl('', Validators.required),
      email: new FormControl({ value: "", disabled: true }, [Validators.required, Validators.email]),
      street: new FormControl(''),
      city: new FormControl(''),
      cityName: new FormControl(''),
      state: new FormControl(''),
      stateName: new FormControl(''),
      zipCode: new FormControl('', [Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')]),
      contactNo: new FormControl('', [Validators.pattern(/^[0-9]{10,15}$/)]),
      image: new FormControl('')
    });
    
  }

  ngOnInit(): void {
    // Get user data
    this.decodeUserToken(this.getToken()).subscribe({
      next: (data:any) => {
        this.token = data;
        console.log(data);
    }
  });

    if (this.token && this.token.email) {
      this.authSer.getUserDataByEmail(this.token.email).subscribe({
        next: (data) => {
          if (data._id) {
            // Assign the sanitized data
            this.id = data._id;
            this.userData = data;
            console.log(data);
            console.log(this.userData); // Log userData after it is set
            this.fillFormWithUserData();
            
            // Now it's safe to call loadUserOrders
            // this.loadUserOrders();
            // this.loadUserComplaints();
          }
        },
        error: (err) => {
          if (err.status == 401)
          {
            this.authSer.logout();
            this.router.navigateByUrl("user/login");
          }
          console.error('Error fetching user data', err)
        }
      });
    } else {
      console.error('Email not found in token');
    }
  
    // Get governorates
    this.locationSer.getGovernorates().subscribe({
      next: (data) => {
        this.governorates = data[2].data;
        console.log(this.governorates);
  
        // Fetch cities for the initial state and call fillFormWithUserData
        if (this.userData && this.userData.address && this.userData.address.state) {
          const selectedGovernorate = this.governorates.find(gov => gov.governorate_name_en === this.userData.address.state);
          if (selectedGovernorate) {
            this.locationSer.getCities(selectedGovernorate.id).subscribe(cityData => {
              this.cities = cityData;
              this.fillFormWithUserData();
            });
          } else {
            this.fillFormWithUserData();
          }
        }
      }
    });
  
    this.userProfileForm.get('state')?.valueChanges.subscribe(governorateId => {
      const selectedGovernorate = this.governorates.find(gov => gov.id === governorateId);
      this.userProfileForm.patchValue({
        stateName: selectedGovernorate ? selectedGovernorate.governorate_name_en : ''
      });
  
      this.locationSer.getCities(governorateId).subscribe(data => {
        this.cities = data;
        console.log(data);
      });
    });
  
    this.userProfileForm.get('city')?.valueChanges.subscribe(cityId => {
      const selectedCity = this.cities.find(city => city.id === cityId);
      this.userProfileForm.patchValue({
        cityName: selectedCity ? selectedCity.city_name_en : ''
      });
    });
  }
  


  
  fillFormWithUserData(): void {
    if (this.userData) {
      // Find the selected governorate based on the name stored in userData
      const selectedGovernorate = this.governorates.find(gov => gov.governorate_name_en === this.userData?.address?.state);
      
      if (selectedGovernorate) {
        // Fetch cities for the selected governorate
        this.locationSer.getCities(selectedGovernorate.id).subscribe(cityData => {
          this.cities = cityData;
  
          // Find the selected city based on the name stored in userData
          const selectedCity = this.cities.find(city => city.city_name_en === this.userData?.address?.city);
  
          // Patch the form with user data
          this.userProfileForm.patchValue({
            firstName: this.userData.firstName,
            lastName: this.userData.lastName,
            email: this.userData.email,
            street: this.userData?.address?.street,
            city: selectedCity ? selectedCity.id : '',
            state: selectedGovernorate ? selectedGovernorate.id : '',
            zipCode: this.userData?.address?.zipCode,
            contactNo: this.userData.contactNo,
            image: this.userData.image,
            cityName: this.userData?.address?.city,
            stateName: this.userData?.address?.state
          });
        });
      } else {
        // Patch the form without city data if governorate is not found
        this.userProfileForm.patchValue({
          firstName: this.userData.firstName,
          lastName: this.userData.lastName,
          email: this.userData.email,
          street: this.userData?.address?.street,
          city: '',
          state: '',
          zipCode: this.userData?.address?.zipCode,
          contactNo: this.userData.contactNo,
          image: this.userData.image,
          cityName: this.userData?.address?.city,
          stateName: this.userData?.address?.state
        });
      }
    }
  }
  
  getToken(): string {
    return this.cookieServices.get('token'); 
  }

  decodeUserToken(token: string): any {
    try {
      const decoded = this.authSer.decodeToken(token);
      console.log('Decoded Token:', decoded); // Log the decoded token
      return decoded;
    } catch (error) {
      console.error('Invalid token', error);
      return null;
    }
  }

onSubmit() {
  console.log(this.userData);
  
  // Update userData with form values and avoid accessing undefined properties
  const updatedUserData = {
    _id: this.id,
    firstName: this.userProfileForm.get('firstName')?.value,
    lastName: this.userProfileForm.get('lastName')?.value,
    email: this.userProfileForm.get('email')?.value,
    address: {
      street: this.userProfileForm.get('street')?.value,
      city: this.userProfileForm.get('cityName')?.value,
      state: this.userProfileForm.get('stateName')?.value,
      zipCode: this.userProfileForm.get('zipCode')?.value,
    },
    contactNo: this.userProfileForm.get('contactNo')?.value,
    image: this.userProfileForm.get('image')?.value
  };

  console.log(updatedUserData);

  if (this.userProfileForm.valid) {
    console.log(updatedUserData); // Log updated user data
    this.authSer.updateUserData(updatedUserData, this.id).subscribe({
      next: (data) => console.log('User data updated successfully', data),
      error: (err) => {
        if (err.status == 401)
        {
          this.authSer.logout();
          this.router.navigateByUrl("user/login");
        }
        console.error('Error updating user data', err)
      }
    });
  } else {
    console.error('Form is invalid');
  }




  if (this.userProfileForm.valid) {
    // Form is valid, process the data
    console.log('Form Submitted', this.userProfileForm.value);
  } else {
    // Form is invalid, handle the errors
    console.log('Form Invalid');
  }

}

// // handel upload image
//   // Method to handle file input change
//   onFileChange(event:any) {
//     const file = event.target.files[0];
//     if (file) {
//       this.userProfileForm.patchValue({
//         image: file
//       });
//       this.userProfileForm.get('image')?.updateValueAndValidity();
//       this.uploadFile(file);
//     }
//   }

//   // Method to upload file to the API
//   uploadFile(file: File) {
//     // const formData = new FormData();
//     // formData.append('file', file, file.name);

//     // const apiEndpoint = 'YOUR_API_ENDPOINT_HERE';
//     // this.http.post(apiEndpoint, formData).subscribe(response => {
//     //   console.log('API Response:', response);
//     //   // Handle the response from the API if needed
//     // }, error => {
//     //   console.error('API Error:', error);
//     //   // Handle error
//     // });
//     // console.log(file);
//     this.uploadSer.uploadImage(file).subscribe({
//       next: (data) => {
//         console.log(data);
//       }
//     })


//   }


  // Method to handle file input change
  onFileChange(event:any) {
    const file = event.target.files[0];
    if (file) {
      this.userProfileForm.patchValue({
        image: file
      });
      this.userProfileForm.get('image')?.updateValueAndValidity();
      this.uploadImage(file); // Call the uploadImage method when a file is selected
    }
  }

  // Method to upload file to the API using the service
  uploadImage(file: File) {
    this.uploadSer.uploadImage(file).subscribe({
      next: (response) => {
        
        console.log('API Response:', response);
        // Handle the response from the API if needed
      },
      error: (error) => {
        console.error('API Error:', error);
        // Handle error
      }
    });
  }







}
