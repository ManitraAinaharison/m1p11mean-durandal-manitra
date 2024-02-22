import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminAuthenticationModule } from './admin-authentication/admin-authentication.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AdminAuthenticationModule
  ],
  exports: [RouterModule]
})
export class DashboardModule { }
