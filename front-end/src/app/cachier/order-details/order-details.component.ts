import { Component, Input, OnInit } from '@angular/core';
import { Order } from '../../_models/order.module';
import { OrderService } from '../../_services/order.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class OrderDetailsComponent implements OnInit {
  @Input() order!: Order; 

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {}

  deleteProduct(productId: string): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this product?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.order.items = this.order.items.filter(item => item.productId !== productId);
        Swal.fire('Deleted!', 'The product has been deleted.', 'success');
      }
    });
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  }
}