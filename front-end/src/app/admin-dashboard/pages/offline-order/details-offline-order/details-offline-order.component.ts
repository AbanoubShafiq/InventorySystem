import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderOffline } from 'src/app/_models/orderOffline.model';

@Component({
  selector: 'app-details-offline-order',
  imports: [FormsModule, CommonModule],
  templateUrl: './details-offline-order.component.html',
  styleUrl: './details-offline-order.component.css'
})
export class DetailsOfflineOrderComponent {
  @Input() show = false;
  @Input() orderOfflineData!: OrderOffline; 
  @Output() close = new EventEmitter<void>();
  onClose(): void {
    this.close.emit();
  }

}
