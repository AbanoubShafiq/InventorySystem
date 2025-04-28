
import { Component, OnInit } from '@angular/core';
import { CartService } from './service/cart.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { RouterModule, Router } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  standalone: true,
  styleUrls: ['./cart.component.css'],
  imports: [CommonModule, RouterModule, FooterComponent]
})
export class CartComponent implements OnInit {

  data: any = {};
  cartItems: any[] = [];
  userId: string | null = null;
  cartItemCount: number = 0;
  branchId:  null = null;
  quantity: number = 0; 


  constructor(private cartService: CartService, private router: Router, private cookieService: CookieService) {}
  ngOnInit(): void {
    this.getUserIdFromToken();
    console.log("Extracted User ID:", this.userId);
  
    if (!this.userId) {
      console.error('User ID not found!');
      Swal.fire('Error', 'User not authenticated!', 'error');
      this.loadGuestCart(); 
      return;
    }
  
    this.branchId = this.branchId;
  
    if (this.userId) {
      this.loadCart(); 
    } else {
      console.error("User not authenticated.");
    }
  }
  // ngOnInit(): void {
  //   this.getUserIdFromToken();
  //   console.log("Extracted User ID:", this.userId);
  
  //   if (!this.userId) {
  //     console.error('User ID not found!');
  //     Swal.fire('Error', 'User not authenticated!', 'error');
  //     this.loadGuestCart();
  //     return;
  //   }
  
  //   this.branchId = this.branchId;
  
  //   if (this.userId) {
  //     this.loadCart();
  
  //     // إذا كانت سلة الضيف موجودة في localStorage، نقوم بنقلها إلى سلة المستخدم
  //     const guestCart = localStorage.getItem('guestCart');
  //     if (guestCart) {
  //       const guestItems = JSON.parse(guestCart);
  //       this.cartService.addToCart(this.userId, guestItems, this.quantity).subscribe(() => {
  //         // بعد النقل، نقوم بإفراغ سلة الضيف في localStorage
  //         localStorage.removeItem('guestCart');
  //         this.loadCart(); // تحميل السلة الجديدة من الـ Backend
  //       });
  //     }
  //   } else {
  //     console.error("User not authenticated.");
  //   }
  // }
  
  loadGuestCart(): void {
  const cart = localStorage.getItem('guestCart');
  if (cart) {
    this.cartItems = JSON.parse(cart);
    this.cartItemCount = this.cartItems.length;
  } else {
    this.cartItems = [];
    this.cartItemCount = 0;
  }
}

addItemToCart(item: any): void {
  if (!this.userId) {
    const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
    guestCart.push(item);
    localStorage.setItem('guestCart', JSON.stringify(guestCart));
  } else {
    this.cartService.addToCart(this.userId, item, this.quantity).subscribe();
  }
}

  
  getUserIdFromToken(): void {
    const token = this.cookieService.get('token'); 
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        this.userId = decodedToken.sub;
        this.branchId = decodedToken.branchId;
        console.log('Decoded Token:', decodedToken);  
        console.log('User ID:', this.userId);        
        console.log('Branch ID:', this.branchId);     
        console.log('Authentication Success');
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }
  
  
  loadCart(): void {
    if (!this.userId) return;
    
    this.cartService.getCart(this.userId).subscribe(res => {
      console.log('Cart Data:', res);
      this.data = res;
      this.data.Total = 0;

      if (res.items && Array.isArray(res.items)) {
        this.cartItems = res.items.map((item: any) => ({
          subInventory: item.subInventory._id,
          branch: item.branch,
          image: item.image,
          quantity: item.quantity,
          price: item.price,
          product: item.subInventory.product,
          subInventoryQuantity: item.subInventory.quantity,
          _id: item._id
        }));
      } else {
        console.error('Items data is not available or not an array');
      }
      this.updateCartRegisteredCustomerProductNum();
    }, error => {
      console.error('Error loading cart:', error);
    });
  }
  increaseQuantity(item: any): void {
    if (!this.userId) return;
  
    this.cartService.increaseQuantity(this.userId, item.subInventory).subscribe(
      () => {
        item.quantity += 1;
        this.updateCartRegisteredCustomerProductNum();
        Swal.fire({
          title: 'Quantity Updated!',
          text: `The quantity has been increased to ${item.quantity}`,
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      },
      error => console.error('Error increasing quantity:', error)
    );
  }
  
  decreaseQuantity(item: any): void {
    if (!this.userId) return;
  
    if (item.quantity > 1) {
      this.cartService.decreaseQuantity(this.userId, item.subInventory).subscribe(
        () => {
          item.quantity -= 1;
          this.updateCartRegisteredCustomerProductNum();
          Swal.fire({
            title: 'Quantity Updated!',
            text: `The quantity has been decreased to ${item.quantity}`,
            icon: 'info',
            timer: 1500,
            showConfirmButton: false
          });
        },
        error => console.error('Error decreasing quantity:', error)
      );
    } else {
      Swal.fire({
        title: 'Are you sure?',
        text: 'This item will be removed from the cart!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, remove it',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          this.removeItem(item.subInventory);
        }
      });
    }
  }
  
  removeItem(subInventoryId: string): void {
    if (!this.userId) return;
  
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won’t be able to undo this action!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, remove it',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cartService.removeFromCart(this.userId!, subInventoryId).subscribe(() => {
          this.cartItems = this.cartItems.filter(item => item.subInventory !== subInventoryId);
          this.updateCartRegisteredCustomerProductNum();
          
          Swal.fire({
            title: 'Removed!',
            text: 'The item has been removed from the cart.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
          });
        });
      }
    });
  }
  

  getTotalPrice(): number {
    return this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  clearCart(): void {
    if (!this.userId) return;
    
    this.cartService.clearCart(this.userId).subscribe(() => {
      this.cartItems = [];
      this.updateCartRegisteredCustomerProductNum();
    });
  }

  checkout(): void {
    if (this.cartItems.length === 0) {
      Swal.fire({ title: 'Cart is Empty!', text: 'There are no products in your cart.', icon: 'warning' });
      return;
    }
    this.router.navigate(['/checkout']);

    // this.cartService.clearCart(this.userId!).subscribe(() => {
    //   this.cartItems = [];
    //   if (!this.userId) {
    //     localStorage.removeItem('guestCart'); 
    //   }
    // });
  }

  updateCartRegisteredCustomerProductNum(): void {
        if (this.userId) {
          this.cartService.getCart(this.userId).subscribe(cart => {
            const count = cart.items.length;
            this.cartItemCount = count;
          });
        } else {
          const cart = localStorage.getItem('cart');
          let allCartProducts: any[] = cart ? JSON.parse(cart) : [];
          this.cartItemCount = allCartProducts.length;
        }
      }
    
      showProductDetails(item: any): void {
        Swal.fire({
          title: item.product.name,
          html: `
            <p><strong>Price:</strong> &euro; ${item.product.price}</p>
            <p><strong>ONLY</strong> ${item.subInventoryQuantity} left</p>
            <p><strong>Description:</strong> ${item.product.description}</p>
            <img src="${item.product.images[0]}" alt="Product Image" class="img-fluid">
          `,
          confirmButtonText: 'Close'
        });
      }
}