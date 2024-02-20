import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { DashboardLayoutComponent } from './core/layouts/pages/dashboard-layout/dashboard-layout.component';
import { WebsiteLayoutComponent } from './core/layouts/pages/website-layout/website-layout.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: '',
    component: WebsiteLayoutComponent,
    loadChildren: () => import('./features/website/website.module').then(m => m.WebsiteModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
