// import { Component, OnInit } from '@angular/core';
// import { CartService } from './../../cart/service/cart.service';
// import { CommonModule } from '@angular/common';
// import Swal from 'sweetalert2';
// import { RouterModule, Router } from '@angular/router';
// import { jwtDecode } from 'jwt-decode';
// import { OfflineOrderService } from './../../_services/OfflineOrder.service';
// import { OfflineOrder, OfflineOrderItem } from './../../_models/offlineOrder.model';

// @Component({
//   selector: 'app-cart-cachier',
//   imports: [CommonModule, RouterModule],
//   templateUrl: './cart-cachier.component.html',
//   styleUrl: './cart-cachier.component.css'
// })
// export class CartCachierComponent {
//   data: any = {};
//   cartItems: any[] = [];
//   userId: string | null = null;
//   branchId: string = '67b129216e1b912065196f93'; 

//   cartItemCount: number = 0;

//   constructor(
//     private cartService: CartService,
//     private offlineOrderService: OfflineOrderService,
//     private router: Router
//     ) {}

//   // ngOnInit(): void {
//   //   // this.userId = this.getUserIdFromToken();
//   //     this.userId = '67ba723899eec16ac3971c6e'
//   //   if (this.userId) {
//   //     this.loadCart();
//   //   } else {
//   //     console.error("User not authenticated.");
//   //   }
//   // }

//    getUserIdFromToken(): string | null {
//      const token = localStorage.getItem('token');
//      if (token) {
//        const decoded: any = jwtDecode(token);
//        return decoded.sub; // استخراج userId
//      }
//      return null;
//    }
//   ngOnInit(): void {
//     this.userId = this.getUserIdFromToken();
//     this.userId = '67ba723899eec16ac3971c6e'
//     this.branchId=this.branchId;
//     if (this.userId) {
//       this.loadCart();
//     } else {
//       console.error("User not authenticated.");
//     }
//   }
//   loadCart(): void {
//     if (!this.userId) return;
  
//     this.cartService.getCart(this.userId).subscribe(
//       res => {
//         console.log('Cart Data:', res);
//         this.data = res;
//         this.data.Total = 0;
  
//         if (res.items && Array.isArray(res.items)) {
//           this.cartItems = res.items.map((item: any) => ({
//             subInventory: item.subInventory._id,
//             branch: item.branch,
//             image: item.image,
//             quantity: item.quantity,
//             price: item.price,
//             product: item.subInventory.product,
//             subInventoryQuantity: item.subInventory.quantity,
//             _id: item._id
//           }));
//         } else {
//           console.error('Items data is not available or not an array');
//         }
//       },
//       error => {
//         console.error('Error loading cart:', error);
//         Swal.fire({
//           title: 'There is No cart',
//           text: "Cart Is Empty",
//           icon: 'error'
//         });
//       }
//     );
//   }

//   increaseQuantity(item: any): void {
//     if (!this.userId) return;
    
//     this.cartService.increaseQuantity(this.userId, item.subInventory).subscribe(
//       () => {
//         item.quantity += 1;
//       },
//       error => console.error('Error increasing quantity:', error)
//     );
//   }

//   decreaseQuantity(item: any): void {
//     if (!this.userId) return;
    
//     if (item.quantity > 1) {
//       this.cartService.decreaseQuantity(this.userId, item.subInventory).subscribe(
//         () => {
//           item.quantity -= 1;
//         },
//         error => console.error('Error decreasing quantity:', error)
//       );
//     } else {
//       this.removeItem(item.subInventory);
//     }
//   }

//   removeItem(subInventoryId: string): void {
//     if (!this.userId) return;
    
//     this.cartService.removeFromCart(this.userId, subInventoryId).subscribe(() => {
//       this.cartItems = this.cartItems.filter(item => item.subInventory !== subInventoryId);
//     });
//   }

//   getTotalPrice(): number {
//     return this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
//   }

//   clearCart(): void {
//     if (!this.userId) return;
    
//     this.cartService.clearCart(this.userId).subscribe(() => {
//       this.cartItems = [];
//     });
//   }

//   // checkout(): void {
//   //   if (this.cartItems.length === 0) {
//   //     Swal.fire({ title: 'Cart is Empty!', text: 'There are no products in your cart.', icon: 'warning' });
//   //     return;
//   //   }

//   //   const orderItems: OfflineOrderItem[] = this.cartItems.map(item => ({
//   //     subInventoryId: item.subInventory,
//   //     price: item.price,
//   //     quantity: item.quantity
//   //   }));

//   //   const order: OfflineOrder = {
//   //     items: orderItems,
//   //     totalPrice: this.getTotalPrice(),
//   //     branch: this.cartItems[0].branch,
//   //     branchId: this.branchId,
//   //     status: 'completed'
//   //   };

//   //   this.offlineOrderService.createOfflineOrder(order).subscribe(
//   //     res => {
//   //       Swal.fire({ title: 'Order Created!', text: 'Your order has been created successfully.', icon: 'success' });
//   //       this.clearCart();
//   //       this.router.navigate(['/cachier']);
//   //     },
//   //     error => {
//   //       Swal.fire({ title: 'Error!', text: 'There was an error creating your order.', icon: 'error' });
//   //       console.error('Error creating order:', error);
//   //     }
//   //   );
//   // }


//   checkout(): void {
//     if (this.cartItems.length === 0) {
//       Swal.fire({ 
//         title: 'Cart is Empty!', 
//         text: 'There are no products in your cart.', 
//         icon: 'warning' 
//       });
//       return;
//     }
  
//     const orderItems: OfflineOrderItem[] = this.cartItems.map(item => ({
//       subInventoryId: item.subInventory,
//       price: item.price,
//       quantity: item.quantity
//     }));
  
//     const order: OfflineOrder = {
//       items: orderItems,
//       totalPrice: this.getTotalPrice(),
//       branch: this.cartItems[0].branch,
//       branchId: this.branchId,
//       status: 'completed'
//     };
  
//     this.offlineOrderService.createOfflineOrder(order).subscribe(
//       res => {
//         Swal.fire({
//           title: 'Order Created!',
//           html: `
//             <p><strong>Total Price:</strong> ${order.totalPrice} EGP</p>
//             <p><strong>Branch:</strong> ${this.branchId}</p>
//             <p>Do you want to print the receipt?</p>
//           `,
//           icon: 'success',
//           showCancelButton: true,
//           confirmButtonText: 'Print & Complete Order',
//           cancelButtonText: 'Complete Order'
//         }).then(result => {
//           if (result.isConfirmed) {
//             this.printReceipt(order);
//           }
//           this.completeOrder();
//         });
//       },
//       error => {
//         Swal.fire({ 
//           title: 'Error!', 
//           text: 'There was an error creating your order.', 
//           icon: 'error' 
//         });
//         console.error('Error creating order:', error);
//       }
//     );
//   }
//   printReceipt(order: OfflineOrder): void {
//     const receiptContent = `
//       Order Receipt
//       --------------------
//       Branch: ${order.branchId}
//       Total Price: ${order.totalPrice} EGP
//       Items:
//       ${order.items.map(item => `- Item ID: ${item.subInventoryId}, Price: ${item.price}, Quantity: ${item.quantity}`).join('\n')}
//     `;
  
//     const blob = new Blob([receiptContent], { type: 'text/plain' });
//     const link = document.createElement('a');
//     link.href = URL.createObjectURL(blob);
//     link.download = `receipt_${new Date().toISOString()}.txt`;
//     link.click();
//   }
//   completeOrder(): void {
//     this.clearCart();
//     this.router.navigate(['/cashier']);
//   }
  
    
//       showProductDetails(item: any): void {
//         Swal.fire({
//           title: item.product.name,
//           html: `
//             <p><strong>Price:</strong> &euro; ${item.product.price}</p>
//             <p><strong>ONLY</strong> ${item.subInventoryQuantity} left</p>
//             <p><strong>Description:</strong> ${item.product.description}</p>
//             <img src="${item.product.images[0]}" alt="Product Image" class="img-fluid">
//           `,
//           confirmButtonText: 'Close'
//         });
//       }
// }
import { Component, OnInit } from '@angular/core';
import { CartService } from './../../cart/service/cart.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { RouterModule, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { OfflineOrderService } from './../../_services/OfflineOrder.service';
import { OfflineOrder, OfflineOrderItem } from './../../_models/offlineOrder.model';
import { BranchService } from './../../_services/branch.service';
import { CookieService } from 'ngx-cookie-service'; 

@Component({
  selector: 'app-cart-cachier',
  imports: [CommonModule, RouterModule],
  templateUrl: './cart-cachier.component.html',
  styleUrl: './cart-cachier.component.css'
})
export class CartCachierComponent implements OnInit {
  data: any = {};
  cartItems: any[] = [];
  userId: string | null = null;
  branchId: string | null = null;
  isLoading: boolean = false; 


  cartItemCount: number = 0;

  constructor(
    private cartService: CartService,
    private offlineOrderService: OfflineOrderService,
    private branchService: BranchService,
    private router: Router,
   private cookieService: CookieService 

  ) {}

  

  
    ngOnInit(): void {
      this.getUserDataFromToken(); 
    }
  
    getUserDataFromToken(): void {
      const token = this.cookieService.get('token'); 
      if (token) {
        try {
          const decodedToken: any = jwtDecode(token); 
          this.userId = decodedToken.sub; 
          this.branchId = decodedToken.branchId || 'defaultBranchId'; 
  
          console.log('User ID:', this.userId);
          console.log('Branch ID:', this.branchId);
  
          if (this.userId) {
            this.loadCart(); 
          }
        } catch (error) {
          console.error('Error decoding token:', error);
        }
      } else {
        console.log('No token found');
      }
    }
  
  loadCart(): void {
    if (!this.userId) return;

    this.cartService.getCart(this.userId).subscribe(
      res => {
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
      },
      error => {
        console.error('Error loading cart:', error);
        Swal.fire({
          title: 'There is No cart',
          text: "Cart Is Empty",
          icon: 'error'
        });
      }
    );
  }
  increaseQuantity(item: any): void {
    if (!this.userId) return;
  
    this.cartService.increaseQuantity(this.userId, item.subInventory).subscribe(
      () => {
        item.quantity += 1;
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
    });
  }


  checkout(): void {
    if (this.cartItems.length === 0) {
      Swal.fire({ 
        title: 'Cart is Empty!', 
        text: 'There are no products in your cart.', 
        icon: 'warning' 
      });
      return;
    }
  
    if (!this.branchId) {
      Swal.fire({ 
        title: 'Error!', 
        text: 'Branch ID is missing.', 
        icon: 'error' 
      });
      return;
    }
  
    this.branchService.getBranchById(this.branchId).subscribe(
      branch => {
        const orderItems: OfflineOrderItem[] = this.cartItems.map(item => ({
          subInventoryId: item.subInventory,
          price: item.price,
          quantity: item.quantity
        }));
  
        const order: OfflineOrder = {
          items: orderItems,
          totalPrice: this.getTotalPrice(),
          branchId: this.branchId!,
          branch: branch,
          status: 'completed'
        };
  
        Swal.fire({
          title: 'Create Order',
          text: `Total Price: ${order.totalPrice} EGP\nBranch: ${branch.branchName}`,
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Complete with Receipt',
          cancelButtonText: 'Complete Order'
        }).then(result => {
          if (result.isConfirmed) {
            this.printReceipt(order);
          }
          this.createOfflineOrder(order);
        });
      },
      error => {
        Swal.fire({ 
          title: 'Error!', 
          text: 'There was an error fetching branch details.', 
          icon: 'error' 
        });
        console.error('Error fetching branch details:', error);
      }
    );
  }
  
  createOfflineOrder(order: OfflineOrder): void {
    this.offlineOrderService.createOfflineOrder(order).subscribe(
      res => {
        Swal.fire({
          title: 'Order Created!',
          html: `
            <p><strong>Total Price:</strong> ${order.totalPrice} EGP</p>
            <p><strong>Branch:</strong> ${order.branch!.branchName}</p>
            <p>The order has been completed successfully.</p>
          `,
          icon: 'success',
          confirmButtonText: 'OK' 
        }).then(result => {
          this.completeOrder();  
        });
      },
      error => {
        Swal.fire({ 
          title: 'Error!', 
          text: 'There was an error creating your order.', 
          icon: 'error' 
        });
        console.error('Error creating order:', error);
      }
    );
  }
  
  
  printReceipt(order: OfflineOrder): void {
    const receiptContent = `
      Order Receipt
      --------------------
      Branch: ${order.branch!.branchName}
      Total Price: ${order.totalPrice} EGP
      Items:
      ${order.items.map(item => `- Item ID: ${item.subInventoryId}, Price: ${item.price}, Quantity: ${item.quantity}`).join('\n')}
    `;
  
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `receipt_${new Date().toISOString()}.txt`;
    link.click();
  }
  
  completeOrder(): void {
    this.clearCart();
    this.router.navigate(['/cashier']);
  }
  
  
  // printReceipt(order: OfflineOrder): void {
  //   const receiptContent = `
  //     Order Receipt
  //     --------------------
  //     Branch: ${order.branch!.branchName}
  //     Total Price: ${order.totalPrice} EGP
  //     Items:
  //     ${order.items.map(item => `- Item ID: ${item.subInventoryId}, Price: ${item.price}, Quantity: ${item.quantity}`).join('\n')}
  //   `;
  
  //   const blob = new Blob([receiptContent], { type: 'text/plain' });
  //   const link = document.createElement('a');
  //   link.href = URL.createObjectURL(blob);
  //   link.download = `receipt_${new Date().toISOString()}.txt`;
  //   link.click();
  // }
  
  // completeOrder(): void {
  //   this.clearCart();
  //   this.router.navigate(['/cashier']);
  // }
  
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

