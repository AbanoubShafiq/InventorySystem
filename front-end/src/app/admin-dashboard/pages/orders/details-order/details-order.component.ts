import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Order } from '../../../../_models/order2.model';

@Component({
  selector: 'app-details-order',
  imports: [FormsModule, CommonModule],
  templateUrl: './details-order.component.html',
  styleUrl: './details-order.component.css'
})
export class DetailsOrderComponent {
    @Input() show = false;
    @Input() orderData!: Order; 
    @Output() close = new EventEmitter<void>();
    onClose(): void {
      this.close.emit();
    }
}
