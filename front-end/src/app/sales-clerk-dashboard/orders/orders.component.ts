import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { OfflineOrderService } from '../services/offline-order.service';
import { OfflineOrder } from '../models/offline-order.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderDetailsModalComponent } from './order-details-modal/order-details-modal.component';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders: OfflineOrder[] = [];
  searchTerm = '';
  statusFilter = 'all';
  loading = false;
  error: string | null = null;
  
  // Use one of the real branch IDs from your data
  branchId: string = '67b129216e1b912065196f93'; // Uptown Branch ID

  constructor(private orderService: OfflineOrderService, private modalService: NgbModal) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.loading = true;
    this.error = null;
    this.orders = []; // Reset orders before loading

    console.log('Loading orders for branch:', this.branchId); // Debug log

    this.orderService.getAllOrdersByBranch(this.branchId)
      .subscribe({
        next: (data) => {
          console.log('Received orders:', data); // Debug log
          this.orders = data;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading orders:', error);
          this.error = typeof error === 'string' ? error : 'Failed to load orders';
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
  }

  cancelOrder(orderId: string) {
    if (confirm('Are you sure you want to cancel this order?')) {
      this.loading = true;
      this.orderService.cancelOrder(orderId).subscribe({
        next: () => {
          this.loadOrders(); // Reload orders after cancellation
          this.loading = false;
        },
        error: (error) => {
          console.error('Error canceling order:', error);
          this.error = 'Failed to cancel order';
          this.loading = false;
        }
      });
    }
  }

  openOrderDetails(order: OfflineOrder) {
    const modalRef = this.modalService.open(OrderDetailsModalComponent, {
      size: 'lg',
      centered: true
    });
    modalRef.componentInstance.order = order;
  }

  get filteredOrders() {
    return this.orders.filter(order => {
      const matchesSearch = 
        order._id.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
        order.branch.branchName.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = this.statusFilter === 'all' || order.status === this.statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }

  getTotalItems(order: OfflineOrder): number {
    return order.items.reduce((total, item) => total + item.quantity, 0);
  }
}
