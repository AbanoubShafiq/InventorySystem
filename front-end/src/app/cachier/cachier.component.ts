import { Component, OnInit } from '@angular/core';
import { OrderService } from '../_services/order.service';
import { ProductService } from '../_services/product.service';
import { OfflineOrderService } from '../_services/OfflineOrder.service'; 
import { Order } from '../_models/order.module';
import { OfflineOrder } from '../_models/offlineOrder.model'; 
import { RouterLink,Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { UserRoleService } from '../_services/user-role.service';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode } from 'jwt-decode';


@Component({
  selector: 'app-cachier',
  templateUrl: './cachier.component.html',
  styleUrls: ['./cachier.component.css'],
  standalone: true,
  imports: [CommonModule, OrderDetailsComponent,RouterLink]
})
export class CachierComponent implements OnInit {
  
  setCashierRole() {
    this.userRoleService.setUserRole('cashier');
  }  orders: Order[] = [];
  offlineOrders: OfflineOrder[] = []; 
  filteredOrders: Order[] = [];
  filteredOfflineOrders: OfflineOrder[] = []; 
  selectedOrder: Order | null = null;
  selectedOfflineOrder: OfflineOrder | null = null; 
  showCancelledOrders: boolean = false;
  branchId: string = ''; 
   userId: string = ''; 

  constructor(
    private orderService: OrderService,
    private productService: ProductService,
    private offlineOrderService: OfflineOrderService ,
    private cookieService: CookieService ,
    private userRoleService: UserRoleService,
    private router: Router

  ) {}

  ngOnInit(): void {
      this.getUserDataFromToken();  
      this.getOfflineOrders();   
  }

  getUserDataFromToken(): void {
    const token = this.cookieService.get('token'); 
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token); 
        this.userId = decodedToken.sub; // 
        this.branchId = decodedToken.branchId || 'defaultBranchId'; 
  
        console.log('User ID:', this.userId);
        console.log('Branch ID:', this.branchId);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    } else {
      console.log('No token found');
    }
  }
  
  getOfflineOrders(): void {
    this.offlineOrderService.getOfflineOrdersByBranchId(this.branchId).subscribe(
      (orders: OfflineOrder[]) => {
        this.offlineOrders = orders;
        this.filterOfflineOrders();
      },
      (error: any) => {
        console.error('Error fetching offline orders:', error);
      }
    );
  }

  filterOfflineOrders(): void {
    this.filteredOfflineOrders = this.offlineOrders.filter(order => 
      order.status === 'completed' || order.status === 'canceled'
    );
  }

  cancelOrder(orderId: string): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to cancel this order?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, cancel it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        const offlineOrder = this.offlineOrders.find(order => order._id === orderId);
        if (offlineOrder) {
          this.offlineOrderService.cancelOfflineOrder(orderId).subscribe(
            () => {
              this.getOfflineOrders();
              Swal.fire('Cancelled!', 'The offline order has been cancelled.', 'success');
            },
            (error: any) => {
              console.error('Error canceling offline order:', error);
              Swal.fire('Error!', 'There was an error canceling the offline order.', 'error');
            }
          );
        }
      }
    });
  }

  toggleCancelledOrders(): void {
    this.showCancelledOrders = !this.showCancelledOrders;
    this.filterOfflineOrders();
  }

  viewDetails(_id: string): void {
    const offlineOrder = this.offlineOrders.find(order => order._id === _id);
    if (offlineOrder) {
      console.log('Offline Order:', offlineOrder); 
      if (offlineOrder.branch && offlineOrder.branch._id) {
        console.log('Branch ID:', offlineOrder.branch._id);

        const branchDetailsPromise = this.offlineOrderService.getBranchById(offlineOrder.branch._id).toPromise();
        const subInventoryDetailsPromises = offlineOrder.items.map(item => {
          return this.offlineOrderService.getSubInventoryById(item.subInventoryId).toPromise();
        });

        Promise.all([branchDetailsPromise, ...subInventoryDetailsPromises]).then(([branch, ...subInventories]) => {
          Swal.fire({
            title: `Order Details - ${offlineOrder._id}`,
            html: `
              <p><strong>Total Price:</strong> ${offlineOrder.totalPrice}</p>
              <p><strong>Status:</strong> ${offlineOrder.status}</p>
              <p><strong>Date:</strong> ${offlineOrder.date}</p>
              <p><strong>Branch:</strong> ${branch?.branchName || 'N/A'}</p>
              <h3>Products</h3>
              <table class="table table-bordered">
                <thead>
                  <tr>
                    <th>Product ID</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  ${offlineOrder.items.map((item, index) => `
                    <tr>
                      <td>${item._id}</td>
                      <td>${item.price}</td>
                      <td>${item.quantity}</td>
                      <td>${(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            `,
            width: '80%',
            confirmButtonText: 'Close',
            customClass: {
              popup: 'swal-wide'
            },
            didOpen: () => {
              const popup = Swal.getPopup();
              if (popup) {
                const deleteButtons = popup.querySelectorAll('.btn-danger');
                deleteButtons.forEach(button => {
                  button.addEventListener('click', (event) => {
                    const subInventoryId = (event.target as HTMLElement).getAttribute('data-sub-inventory-id');
                    const quantity = parseInt((event.target as HTMLElement).getAttribute('data-quantity')!, 10);
                    if (subInventoryId) {
                      this.confirmRemoveItem(offlineOrder._id!, subInventoryId, quantity);
                    } else {
                      console.error('Sub-Inventory ID is undefined');
                    }
                  });
                });
              }
            }
          });
          
        }).catch(error => {
          console.error('Error fetching details:', error);
        });
      } else {
        console.error('Branch is undefined or branch ID is missing');
      }
    }
  }

  confirmRemoveItem(orderId: string, productId: string, quantity: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this product from the order?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.offlineOrderService.deleteProductFromOrder(orderId, productId, quantity).subscribe(
          () => {
            this.getOfflineOrders();
            Swal.fire('Deleted!', 'The product has been removed from the order.', 'success');
          },
          (error: any) => {
            console.error('Error deleting product from order:', error);
            Swal.fire('Error!', 'There was an error deleting the product from the order.', 'error');
          }
        );
      }
    });
  }

  sortColumn: string = '';
sortDirection: 'asc' | 'desc' = 'asc';
sortData(column: string) {
  if (this.sortColumn === column) {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
  } else {
    this.sortColumn = column;
    this.sortDirection = 'asc';
  }

  this.filteredOfflineOrders.sort((a: any, b: any) => {
    let valueA = a[column];
    let valueB = b[column];

    if (typeof valueA === 'string') {
      valueA = valueA.toLowerCase();
      valueB = valueB.toLowerCase();
    }

    if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
    if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  this.filteredOfflineOrders = [...this.filteredOfflineOrders];
}
}
//                    <th>Actions</th>

// <td><button class="btn btn-danger btn-sm" data-sub-inventory-id="${item.subInventoryId}" data-quantity="${item.quantity}">Delete</button></td>
