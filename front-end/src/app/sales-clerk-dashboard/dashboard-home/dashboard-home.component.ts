import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid">
      <h2 class="mb-4">Dashboard Overview</h2>
      
      <div class="row">
        <div class="col-md-6 mb-4">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Recent Orders</h5>
              <h2 class="card-text">{{totalOrders}}</h2>
              <p class="text-muted">Total orders today</p>
            </div>
          </div>
        </div>

        <div class="col-md-6 mb-4">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Branch Products</h5>
              <h2 class="card-text">{{totalProducts}}</h2>
              <p class="text-muted">Products in inventory</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      border: none;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .card-title {
      color: #6c757d;
      font-size: 1rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .card-text {
      color: #2c3e50;
      margin: 10px 0;
    }
  `]
})
export class DashboardHomeComponent implements OnInit {
  totalOrders = 0;
  totalProducts = 0;

  ngOnInit() {
    // TODO: Fetch actual data from your service
    this.totalOrders = 15;
    this.totalProducts = 150;
  }
}
