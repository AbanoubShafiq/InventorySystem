
import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart/service/cart.service';
import { CheckoutService } from './service/checkout.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service'; 

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule]
})
export class CheckoutComponent implements OnInit {
  firstName: string = '';
  lastName: string = '';
  address: string = '';
  street: string = '';
  city: string = '';
  zipCode: string = '';
  phoneNumber: string = '';
  email: string = '';
  paymentMethod: string = 'Cash';
  comments: string = '';
  data: any = {};
  userId: string = ''; 

  governorates = [
    { name: 'Cairo', cities: ['Nasr City', 'Heliopolis', 'Maadi', 'Shubra', 'Zamalek', 'New Cairo'] },
    { name: 'Alexandria', cities: ['Sidi Gaber', 'Mansheya', 'Smouha', 'Montaza', 'Borg El Arab'] },
    { name: 'Giza', cities: ['Dokki', 'Mohandessin', 'Haram', '6th of October', 'Sheikh Zayed'] },
    { name: 'Qalyubia', cities: ['Banha', 'Shibin El Qanater', 'Khosous'] },
    { name: 'Port Said', cities: ['Al Manakh', 'Al Sharq', 'Al Zohour'] },
    { name: 'Suez', cities: ['Arbaeen', 'Ganayen', 'Faisal'] },
    { name: 'Sharqia', cities: ['Zagazig', 'Belbeis', 'Minya Al Qamh'] },
    { name: 'Dakahlia', cities: ['Mansoura', 'Talkha', 'Mit Ghamr'] },
    { name: 'Aswan', cities: ['Aswan City', 'Kom Ombo', 'Edfu'] },
    { name: 'Asyut', cities: ['Asyut City', 'Dairut', 'Manfalut'] },
    { name: 'Beheira', cities: ['Damanhour', 'Kafr El Dawar', 'Rashid'] },
    { name: 'Beni Suef', cities: ['Beni Suef City', 'Biba', 'El Wasta'] },
    { name: 'Fayoum', cities: ['Fayoum City', 'Tamiya', 'Sinnuris'] },
    { name: 'Gharbia', cities: ['Tanta', 'El Mahalla El Kubra', 'Zefta'] },
    { name: 'Ismailia', cities: ['Ismailia City', 'Fayed', 'Al Qantara'] },
    { name: 'Kafr El Sheikh', cities: ['Kafr El Sheikh City', 'Desouk', 'Baltim'] },
    { name: 'Matruh', cities: ['Marsa Matruh', 'Siwa', 'El Dabaa'] },
    { name: 'Minya', cities: ['Minya City', 'Mallawi', 'Beni Mazar'] },
    { name: 'Monufia', cities: ['Shibin El Kom', 'Menouf', 'Ashmoun'] },
    { name: 'New Valley', cities: ['Kharga', 'Dakhla', 'Farafra'] },
    { name: 'North Sinai', cities: ['Arish', 'Sheikh Zuweid', 'Rafah'] },
    { name: 'Qena', cities: ['Qena City', 'Nag Hammadi', 'Luxor'] },
    { name: 'Red Sea', cities: ['Hurghada', 'Safaga', 'Marsa Alam'] },
    { name: 'Sohag', cities: ['Sohag City', 'Girga', 'Akhmim'] },
    { name: 'South Sinai', cities: ['Sharm El Sheikh', 'Dahab', 'Nuweiba'] },
    { name: 'Damietta', cities: ['Damietta City', 'New Damietta', 'Faraskour'] },
    { name: 'Luxor', cities: ['Luxor City', 'Esna', 'Armant'] }
  ];

  selectedGovernorate: string = '';
  cities: string[] = [];
  constructor(
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private router: Router,
    private http: HttpClient,
    private cookieService: CookieService 
  ) {}
  ngOnInit(): void {
    this.getUserIdFromToken();
  
    if (!this.userId) {
      console.error('User ID not found!');
      Swal.fire('Error', 'User not authenticated!', 'error');
      return;
    }
  
    this.cartService.getCart(this.userId).subscribe(
      (res: any) => {
        console.log(res.items);
        this.data = res;
        this.data.Total = res.items?.reduce((total: number, item: any) => total + item.price * item.quantity, 0) || 0;
      },
      error => console.error('Error loading cart:', error)
    );
  }
  
  getUserIdFromToken(): void {
    const token = this.cookieService.get('token'); 
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1])); 
        this.userId = payload.sub; 
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }
  

  validateCartItems(): boolean {
    let isValid = true;
    this.data.items.forEach((item: any, index: number) => {
      if (item.subInventory.product.quantity === 0) {
        Swal.fire('Out of Stock!', `${item.subInventory.product.name} is out of stock.`, 'warning');
        isValid = false;
      }
    });
    return isValid;
  }

  removeItem(productId: string): void {
    this.cartService.removeFromCart(this.userId, productId).subscribe(() => {
      this.data.items = this.data.items.filter((item: any) => item.subInventory.product._id !== productId);
    });
  }

  onGovernorateChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const governorate = target.value;
    const selected = this.governorates.find(g => g.name === governorate);
    this.cities = selected ? selected.cities : [];
  }

  convertToPaymentMethod(value: string): 'Cash' | 'Card' | 'Online' {
    if (['Cash', 'Card', 'Online'].includes(value)) return value as 'Cash' | 'Card' | 'Online';
    throw new Error('Invalid payment method');
  }

  isValidEmail(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  placeOrder(): void {
    if (!this.validateCartItems()) return;

    const customerDetails = {
      firstName: this.firstName,
      lastName: this.lastName,
      address: { street: this.street, city: this.city, zipCode: this.zipCode },
      email: this.email,
      phone: this.phoneNumber
    };

    if (!this.isValidOrder(customerDetails)) return;

    const orderItems = this.data.items.map((item: any) => ({
      productId: item.subInventory.product._id,
      quantity: item.quantity,
      price: item.subInventory.product.price,
      subInventoryId: item.subInventory._id
    }));

    const orderData = {
      customerId: this.userId, 
      items: orderItems,
      totalPrice: orderItems.reduce((total: number, item: any) => total + item.price * item.quantity, 0),
      status: 'pending',
      paymentMethod: this.convertToPaymentMethod(this.paymentMethod),
      customerDetails,
      notes: this.comments
    };

    this.checkoutService.createOrder(orderData).subscribe({
      next: (res: any) => {
        console.log('Order created successfully', res);
        if (this.paymentMethod === 'Cash' || this.paymentMethod === 'Card') {
          this.cartService.clearCart(this.userId).subscribe(() => {
            Swal.fire('Success', 'Order placed successfully!', 'success').then(() => this.router.navigate(['/']));
          });
        }
      },
      error: (err: any) => {
        console.error('Error creating order', err);
        
        if (err.status === 400 && err.error && err.error.error === 'Invalid email address') {
          Swal.fire('Invalid Email', 'Please provide a valid email address', 'error');
        } else {
          Swal.fire('Error', 'Something went wrong. Please try again.', 'error');
        }
      }
    });
  }
  

  isValidOrder(customerDetails: any): boolean {
    if (!customerDetails.firstName || !customerDetails.lastName || !customerDetails.email || !customerDetails.phone || 
        !customerDetails.address.street || !customerDetails.address.city || !customerDetails.address.zipCode) {
      Swal.fire('Incomplete Details', 'Please complete your billing details', 'warning');
      return false;
    }
  
    if (customerDetails.firstName.length < 3 || customerDetails.lastName.length < 3) {
      Swal.fire('Invalid Name', 'First name and last name must be at least 3 characters long', 'warning');
      return false;
    }
  
    if (!this.isValidEmail(customerDetails.email)) {
      Swal.fire('Invalid Email', 'Please provide a valid email address', 'warning');
      return false;
    }
  
    const phonePattern = /^[0-9]{11}$/;
    if (!phonePattern.test(customerDetails.phone)) {
      Swal.fire('Invalid Phone Number', 'Phone number must be exactly 11 digits', 'warning');
      return false;
    }
  
    return true;
  }
  

  trackByProductId(index: number, item: any): number {
    return item.subInventory.product ? item.subInventory.product._id : index;
  }
}
