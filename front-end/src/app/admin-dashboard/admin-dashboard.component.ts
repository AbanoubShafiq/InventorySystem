import { Component, NgModule } from '@angular/core';
import { HeaderComponent } from './core/header/header.component';
import { SidenavComponent } from './core/sidenav/sidenav.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from "./core/footer/footer.component";
import { MatDialogModule } from '@angular/material/dialog';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-admin-dashboard',
  imports: [RouterOutlet, HeaderComponent, SidenavComponent, MatSidenavModule, MatIconModule, MatListModule, MatToolbarModule, MatMenuModule, MatDividerModule, FooterComponent,MatDialogModule,NgxChartsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent {
  title = 'admin-panel-layout';
  sideBarOpen = true;

  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }
}
