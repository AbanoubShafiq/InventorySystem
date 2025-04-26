import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { FooterComponent } from './shared/footer/footer.component';

@Component({
  selector: 'app-sales-clerk-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, FooterComponent],
  templateUrl: './sales-clerk-dashboard.component.html',
  styleUrls: ['./sales-clerk-dashboard.component.css']
})
export class SalesClerkDashboardComponent {
  
}
