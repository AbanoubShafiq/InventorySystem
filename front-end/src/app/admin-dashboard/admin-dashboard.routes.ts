import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UsersComponent } from './pages/users/users.component';
import { SellersComponent } from './pages/sellers/sellers.component';
import { ProductsComponent } from './pages/products/products.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { ContactComponent } from './pages/contact/contact.component';
import { SalesClerkComponent } from './pages/sales-clerk/sales-clerk.component';
import { CashierComponent } from './pages/cashier/cashier.component';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { CategoryComponent } from './pages/category/category.component';
import { MainInventoryComponent } from './pages/main-inventory/main-inventory.component';
import { BranchComponent } from './pages/branch/branch.component';
import { SubInventoryComponent } from './pages/sub-inventory/sub-inventory.component';
import { OfflineOrderComponent } from './pages/offline-order/offline-order.component';
import { DistReqComponent } from './pages/dist-req/dist-req.component';
//import { ReviewComponent } from './pages/review/review.component';



export const adminDashboardRoutes: Routes = [
    {path:"",component:AdminDashboardComponent, children:[
        { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
        { path: 'dashboard', component: DashboardComponent },
        { path: 'users', component: UsersComponent},
        { path: 'sellers', component: SellersComponent },
        { path: 'products', component: ProductsComponent },
        { path: 'orders', component:OrdersComponent },
        { path: 'categories', component: CategoryComponent },
    // { path: 'reviews', component: ReviewComponent },
        { path: 'contact-us', component: ContactComponent },
        { path: 'sales-clerks', component: SalesClerkComponent },
        { path: 'cashiers', component: CashierComponent },
        { path: 'mainInventories', component: MainInventoryComponent },
        { path: 'branches', component: BranchComponent },
        { path: 'subInventory/:branchName', component: SubInventoryComponent },
        { path: 'orders/:_id', component: OfflineOrderComponent },
        { path: 'distReq', component: DistReqComponent },

    ]},  
];