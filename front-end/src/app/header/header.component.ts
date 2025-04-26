import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthServiceService } from '../_services/auth-service.service';
import { Observable, of } from 'rxjs';
// >>>>>>>>> import { CartService } from '../cart/service/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  imports: [CommonModule,RouterLink],
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  userRole:string|null=null;//='customer';
  isauthenticated:boolean=false;

  //>>>>>>>>> cartItems: any[] = []; 


  constructor(
    public cookieSer:CookieService,
    public router:Router,
    private authSer:AuthServiceService,
 //>>>>>>>>>>   private cartService: CartService
  )
  {

  }
  token:any;
  userEmail:any;
  userData: any = null; 

      
  ngOnInit(): void {

    const token = this.getToken();
    if (!token) {
      console.error('No token found');
      return;
      
    }
    
   
  
    this.decodeUserToken(token).subscribe({
      next: (data: any) => {
        if (data && data.role) {
          this.userRole = data.role;
          console.log('User Role:', this.userRole);
        } else {
          console.error('Invalid or missing role in token');
        }
  
        if (data && data.email) {
          this.userEmail = data.email;
          console.log('User Email:', this.userEmail);
  
          // Fetch additional user data by email
          this.fetchUserDataByEmail();
        } else {
          console.error('Invalid or missing email in token');
        }
        // >>>>>>>>this.loadCart();
      },
      
      error: (err: any) => console.error('Error decoding token', err)
    });
  }
  // >>>>>>> loadCart(): void {
  //   const userId = this.cookieSer.get('userId'); 
  //   if (!userId) return;
  
  //   this.cartService.getCart(userId).subscribe(res => {
  //     console.log('Cart Data:', res);
  //     this.cartItems = res.items.map((item: any) => ({
  //       subInventory: item.subInventory._id,
  //       branch: item.branch,
  //       image: item.image,
  //       quantity: item.quantity,
  //       price: item.price,
  //       product: item.subInventory.product, 
  //       subInventoryQuantity: item.subInventory.quantity,
  //       _id: item._id
  //     }));
  //     console.log('Updated Cart Items:', this.cartItems);
  //   }, error => {
  //     console.error('Error loading cart:', error);
  //   });
  // }
  
  
  fetchUserDataByEmail(): void {
    if (!this.userEmail) {
      console.error('No email available to fetch user data');
      return;
    }
  
    this.authSer.getUserDataByEmail(this.userEmail).subscribe({
      next: (userData: any) => {
        if (userData && userData.firstName) {
          this.userFirstName = userData.firstName;
          console.log('User First Name:', this.userFirstName);
          // Example: Store user data in a property
          this.userData = userData; // Assuming you have a `userData` property
        } else {
          console.error('First name is missing or invalid');
        }
      },
      error: (err: any) => console.error('Error fetching user data', err)
    });
  }
  userFirstName:any;

  
  // Mock cart items (replace with actual cart logic)
  cartItems = [
    { id: 1, name: 'Eternity Perfume', price: 79.99 ,image: '',
      quantity: 2},
    { id: 1, name: 'Eternity Perfume', price: 79.99 ,image: '',
      quantity: 2},
    { id: 2, name: 'Ocean Breeze', price: 69.99 ,image: '',
      quantity: 2}
  ];

  // Get the total number of items in the cart
  getCartItemCount(): number {
    return this.cartItems.length;
  }

  // Clear the cart (optional functionality)
  clearCart(): void {
    this.cartItems = [];
  }
  
  selected: string = 'home';
  updateSelect(selectedd: string): void {
    this.selected = selectedd;
  }


  increaseQuantity(item: any): void {
    if (item.quantity < 10) {
      item.quantity++;
      console.log('Increased quantity to:', item.quantity);
    } else {
      alert(`Sorry, only ${10} units are available in stock.`);
    }
  }
  
  decreaseQuantity(item: any): void {
    if (item.quantity > 1) {
      item.quantity--;
    }
  }
  removeFromCart(index: number): void {
    this.cartItems.splice(index, 1); 
  }
  calculateTotal(): number {
    return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
  getToken(): string {
    return this.cookieSer.get('token'); 
  }
  // decodeUserToken(token: string): Observable<any> {
  //   try {
  //     const decoded = this.authSer.decodeToken(token);
  //     console.log('Decoded Token:', decoded); 
  //     return decoded;
  //   } catch (error) {
  //     console.error('Invalid token', error);
  //     return of (null);
  //   }
  // }
  decodeUserToken(token: string): Observable<any> {
    try {
      const decoded = this.authSer.decodeToken(token);
      console.log('Decoded Token:', decoded);
      return of(decoded); 
    } catch (error) {
      console.error('Invalid token', error);
      return of(null); 
    }
  }
  LogOut(): void {
    this.authSer.logout();
    this.router.navigateByUrl('');
    this.isauthenticated = false;
  
    // Reset user-related properties
    this.userRole = null;
    this.userEmail = null;
    this.userData = null;
  }

  
}