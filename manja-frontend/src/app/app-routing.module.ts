import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardLayoutComponent } from './core/layouts/pages/dashboard-layout/dashboard-layout.component';
import { WebsiteLayoutComponent } from './core/layouts/pages/website-layout/website-layout.component';
import { AdminLoginComponent } from './features/dashboard/admin-authentication/pages/admin-login/admin-login.component';
import { authGuard } from './core/guards/auth.guard';
import { currentCustomerResolver } from './core/layouts/resolvers/current-customer.resolver';

const routes: Routes = [
  {
    path: 'dashboard/login',
    component: AdminLoginComponent,
    pathMatch: "full"
  },
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [authGuard]
  },
  {
    path: '',
    component: WebsiteLayoutComponent,
    loadChildren: () => import('./features/website/website.module').then(m => m.WebsiteModule),
    resolve: {
      currentCustomer: currentCustomerResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
