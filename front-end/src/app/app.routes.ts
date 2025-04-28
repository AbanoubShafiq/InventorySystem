import { Routes } from '@angular/router';
import { CartComponent } from './cart/cart.component';
import { LoginComponent } from './authentication/login/login.component';
import { CheckoutComponent } from './checkout/checkout.component';

import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { CatalogComponent } from './catalog/catalog.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { NotFoundComponent } from './not-found/not-found.component';
// import { RegisterComponent } from './authentication/register/register.component';
// import { UserProfileComponent } from './user-profile/user-profile.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { SellerDashboardComponent } from './seller-dashboard/seller-dashboard.component';
import { canLoginSuperAdminGuard } from './_guards/can-login-super-admin.guard';
import { CachierComponent } from './cachier/cachier.component';
import { CartCachierComponent } from './cachier/cart-cachier/cart-cachier.component';
import { CartCheckoutGuard } from './cart/_guards/cart-checkout.guard';
import { CashierGuard } from './cachier/_guard/cashier.guard'




export const routes: Routes = [
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: 'cart', component: CartComponent, canActivate: [CartCheckoutGuard] },
  { path: 'checkout', component: CheckoutComponent, canActivate: [CartCheckoutGuard] },
  { path: 'cashier', component: CachierComponent, canActivate: [CashierGuard] },
  { path: 'cartCashier', component: CartCachierComponent, canActivate: [CashierGuard] },
  {path:"admindashboard", loadChildren:()=>import("./admin-dashboard/admin-dashboard.routes").then(s=>s.adminDashboardRoutes),canActivate: [canLoginSuperAdminGuard]},
  {path: "user", loadChildren: ()=> import("./authentication/user.routes").then(route => route.userRoutes)},
  {path:"home",component:HomeComponent},
  {path:"",component:HomeComponent},
  {path:"about",component:AboutComponent},
  {path:"catalog",component:CatalogComponent},
  {path:"catalog/details/:id",component:ProductDetailsComponent},
  {path:"contact",component:ContactUsComponent},
  // {path:"login",component:LoginComponent},
  // {path:"register",component:RegisterComponent},
  // {path:"userprofile",component:UserProfileComponent},
  {
    path: "sellerdashboard",
    component: SellerDashboardComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./seller-dashboard/seller-dashboard.routes')
          .then(m => m.SELLER_DASHBOARD_ROUTES)
      }
    ]
  },
  
  {path:"**",component:NotFoundComponent},
  {
    path: 'login',
    component: LoginComponent
  },

  // { path: '', redirectTo: 'seller', pathMatch: 'full' },
  
];

