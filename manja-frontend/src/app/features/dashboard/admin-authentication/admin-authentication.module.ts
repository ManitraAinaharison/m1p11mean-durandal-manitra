import { NgModule } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AdminLoginComponent } from './pages/admin-login/admin-login.component';

@NgModule({
  declarations: [
    AdminLoginComponent
  ],
  imports: [
    CommonModule,
    NgIf,
    ReactiveFormsModule
  ]
})
export class AdminAuthenticationModule { }
