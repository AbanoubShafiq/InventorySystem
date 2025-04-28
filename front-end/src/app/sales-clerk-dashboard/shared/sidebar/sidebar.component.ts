import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="sidebar">
      <div class="brand-logo">
        <h2>Sales Clerk Portal</h2>
      </div>
      
      <nav class="sidebar-nav">
        <ul class="nav flex-column">
          <li class="nav-item" *ngFor="let item of menuItems">
            <a [routerLink]="item.path" routerLinkActive="active" class="nav-link">
              <i [class]="item.icon"></i> {{item.title}}
            </a>
          </li>
        </ul>
      </nav>
    </div>
  `,
  styles: [`
    .sidebar {
      width: 250px;
      height: 100vh;
      position: sticky;
      top: 0;
      left: 0;
      background: #00004d;
      color: white;
      box-shadow: 2px 0 5px rgba(0, 0, 0, 0.2);
      z-index: 1000;
      overflow-y: auto;
    }

    .brand-logo {
      padding: 1.5rem;
      text-align: center;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .brand-logo h2 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
      color: white;
      letter-spacing: 1px;
    }

    .sidebar-nav {
      padding: 1rem 0.5rem;
    }

    .nav-item {
      margin: 0.5rem 0;
    }

    .nav-link {
      padding: 0.8rem 1.5rem;
      color: rgba(255, 255, 255, 0.8) !important;
      transition: all 0.3s ease;
      border-radius: 8px;
      margin: 0 0.5rem;
      display: flex;
      align-items: center;
    }

    .nav-link:hover {
      background-color: rgba(255, 255, 255, 0.1);
      color: white !important;
      transform: translateX(5px);
    }

    .nav-link.active {
      background-color: rgba(255, 255, 255, 0.2);
      color: white !important;
      font-weight: 500;
    }

    .nav-link i {
      width: 20px;
      text-align: center;
      margin-right: 10px;
      font-size: 1.1rem;
    }
  `]
})
export class SidebarComponent {
  menuItems = [
    { path: './home', icon: 'fas fa-home', title: 'Dashboard' },
    { path: './orders', icon: 'fas fa-shopping-cart', title: 'Orders' },
    { path: './branch-products', icon: 'fas fa-box', title: 'Branch Products' }
  ];
}
