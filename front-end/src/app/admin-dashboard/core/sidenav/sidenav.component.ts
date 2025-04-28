import { Component, OnInit } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Branch } from 'src/app/_models/branch.model';
import { BranchService } from 'src/app/_services/branch.service';
import { SubInventoryService } from 'src/app/_services/sub-inventory.service';
import { SubInventory } from 'src/app/_models/sub-inventory.model';

@Component({
  selector: 'app-sidenav',
  imports: [MatSidenavModule,MatIconModule,MatListModule,MatToolbarModule,MatMenuModule,MatDividerModule,RouterModule,CommonModule],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css',
})
export class SidenavComponent implements OnInit {
  branches: Branch[] = [];
  showSubMenu = false;

  constructor(
    private branchService: BranchService,
  ) {}

  ngOnInit(): void {
    this.loadBranches();
  }

  loadBranches(): void {
    this.branchService.getbranchesBasedOnType("offline").subscribe({
      next: (response) => {
        this.branches = response.map(branch => ({ ...branch, showSubSubMenu: false }));
      },
      error: (error) => console.error('❌ Error fetching branches:', error)
    });
  }

  toggleSubMenu() {
    this.showSubMenu = !this.showSubMenu;
  }

  toggleBranchMenu(branch: Branch, event: Event) {
    event.stopPropagation();
    branch.showSubSubMenu = !branch.showSubSubMenu;
  }
  showMenu = false;

toggleOnlineBranch() {
  this.showMenu = !this.showMenu;
}

}
