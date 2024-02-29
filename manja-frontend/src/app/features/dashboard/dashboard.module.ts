import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AdminAuthenticationModule } from './admin-authentication/admin-authentication.module';
import { ManagerModule } from './manager/manager.module';
import { NotFoundComponent } from '../../shared/components/not-found/not-found.component';
import { EmployeeModule } from './employee/employee.module';


const notFoundRoute: Routes = [
  // {
  //   path: '**',
  //   component: NotFoundComponent,
  // }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AdminAuthenticationModule,
    ManagerModule,
    EmployeeModule,
    RouterModule.forChild(notFoundRoute)
  ],
  exports: [RouterModule]
})
export class DashboardModule { }
