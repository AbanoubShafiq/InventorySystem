import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './layout/header/header.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { FooterComponent } from './layout/footer/footer.component';

@Component({
  selector: 'app-seller-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    HeaderComponent, 
    SidebarComponent, 
    FooterComponent
  ],
  template: `
    <div class="dashboard-container">
      <app-sidebar></app-sidebar>
      <div class="main-content">
        <app-header></app-header>
        <div class="content p-4">
          <router-outlet></router-outlet>
        </div>
        <app-footer></app-footer>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      display: flex;
      min-height: 100vh;
    }
    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      margin-left: 250px; /* Match sidebar width */
    }
    .content {
      flex: 1;
      background-color: #f8f9fa;
      overflow-y: auto; /* This enables vertical scrolling */
      padding: 1.5rem;
      min-height: calc(100vh - 60px - 200px); /* Adjust for header and footer */
    }
    :host {
      display: block;
      height: 100vh;
      overflow-y: auto; /* Change this from 'hidden' to 'auto' */
    }
    app-footer {
      margin-top: auto;
    }
  `]
})
export class SellerDashboardComponent {}