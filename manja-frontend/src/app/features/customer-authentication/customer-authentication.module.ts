import { NgModule } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { LoginComponent } from './pages/login/login.component';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';


const authRoutes: Routes = [
  { path: 'login', component: LoginComponent }
]


@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    NgIf,
    ReactiveFormsModule,
    RouterModule.forChild(authRoutes)
  ]
})
export class CustomerAuthenticationModule { }
