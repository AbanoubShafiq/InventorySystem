import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class SidebarComponent {
  constructor(private router: Router) {}

  // Update navigation methods to use correct paths
  navigateToProducts(): void {
    this.router.navigate(['/sellerdashboard/products']);
  }

  navigateToOrders(): void {
    this.router.navigate(['/sellerdashboard/orders']);
  }

  navigateToAnalytics(): void {
    this.router.navigate(['/sellerdashboard/sales']);
  }
}