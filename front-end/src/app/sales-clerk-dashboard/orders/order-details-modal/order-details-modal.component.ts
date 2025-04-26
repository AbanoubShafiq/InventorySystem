import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OfflineOrder } from '../../models/offline-order.model';

@Component({
  selector: 'app-order-details-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Order Details</h4>
      <button type="button" class="btn-close" aria-label="Close" (click)="activeModal.dismiss()"></button>
    </div>
    <div class="modal-body">
      <div class="order-info mb-3">
        <h5>Order Information</h5>
        <p><strong>Order ID:</strong> {{order._id}}</p>
        <p><strong>Date:</strong> {{order.date | date:'medium'}}</p>
        <p><strong>Status:</strong> 
          <span class="badge"
                [class.bg-warning]="order.status === 'pending'"
                [class.bg-success]="order.status === 'completed'"
                [class.bg-danger]="order.status === 'canceled'">
            {{order.status}}
          </span>
        </p>
        <p><strong>Total Amount:</strong> {{order.totalPrice | currency}}</p>
      </div>
      
      <div class="items-info">
        <h5>Order Items</h5>
        <table class="table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of order.items">
              <td>{{item.subInventoryId.product}}</td>
              <td>{{item.quantity}}</td>
              <td>{{item.price | currency}}</td>
              <td>{{item.price * item.quantity | currency}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" (click)="activeModal.close()">Close</button>
    </div>
  `
})
export class OrderDetailsModalComponent {
  @Input() order!: OfflineOrder;
  
  constructor(public activeModal: NgbActiveModal) {}
}