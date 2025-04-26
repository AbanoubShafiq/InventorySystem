import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from 'src/app/_services/order.service';
import { Order } from 'src/app/_models/order.module';

import Swal from 'sweetalert2';
import { AuthServiceService } from 'src/app/_services/auth-service.service';

@Component({
  selector: 'app-user-orders',
  imports: [CommonModule],
  templateUrl: './user-orders.component.html',
  styleUrl: './user-orders.component.css'
})
export class UserOrdersComponent implements OnInit
 {

  noOfOrder:number = 0;
  totalSpend:number = 0;
  userOrder:Order[] = [];
  id:any;

  constructor(
    private orderSer: OrderService,
    private route: ActivatedRoute,
    private authSer: AuthServiceService,
    private router: Router

  ) { }
  ngOnInit(): void {
      this.route.params.subscribe(params => {
        this.id = params['id'];
        this.loadUserOrders();
      });

  }


  loadUserOrders() {
    this.orderSer.getOrdersByCustomerId(this.id).subscribe({
      next: (orders) => {
        this.userOrder = orders;
        this.noOfOrder = orders.length;
        this.totalSpend = orders.reduce((total, order) => total + order.totalPrice, 0);
        console.log(orders);
        console.log(this.userOrder);
      },
      error: (err) => {
        if (err.status === 401) {
          this.authSer.logout();
          this.router.navigateByUrl("user/login");
        } else {
          console.error('Error fetching orders', err);
        }
      }
    });
  }













  
  viewOrder(order:Order) {
    console.log(order);
    const orderDetails = `
        <div style="text-align: left;">
            <h5 class="text-primary"><strong>Order ID:</strong> ${order._id}</h5>
            <hr>
            <h6 class="fw-bold">Customer Details</h6>
            <p><strong>Name:</strong> ${order.customerDetails.firstName} ${order.customerDetails.lastName}</p>
            <p><strong>Email:</strong> ${order.customerDetails.email}</p>
            <p><strong>Phone:</strong> ${order.customerDetails.phone}</p>
            
            <h6 class="fw-bold">Address</h6>
            <p>${order.customerDetails.address.street}, ${order.customerDetails.address.city}, ${order.customerDetails.address.zipCode}</p>
            
            <h6 class="fw-bold">Order Info</h6>
            <p><strong>Total Price:</strong> <span class="text-success fw-bold">$${order.totalPrice}</span></p>

            
            <p><strong>Status:</strong> <span >${order.status}</span></p>

            <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
            <p><strong>Date:</strong> ${order.date}</p>
            <p><strong>Notes:</strong> ${order.notes || '<span class="text-muted">N/A</span>'}</p>
            
            <h6 class="fw-bold">Items</h6>
            <div style="max-height: 200px; overflow-y: auto; border: 1px solid #ddd; padding: 10px; border-radius: 5px; background: #f8f9fa;">
                ${order.items.map(item => `
                    <div style="border-bottom: 1px solid #ddd; padding: 8px 0;">
                        <p><strong>Product ID:</strong> ${item.productId}</p>
                        <p><strong>Price:</strong> $${item.price}</p>
                        <p><strong>Quantity:</strong> ${item.quantity}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    Swal.fire({
        title: '<strong>Order Details</strong>',
        html: orderDetails,
        icon: 'info',
        width: '600px',
        confirmButtonText: 'Close',
        customClass: {
            popup: 'swal-order-popup'
        }
    });
}




}
