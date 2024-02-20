import { NgModule } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { LoginComponent } from './pages/login/login.component';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CustomerSignupComponent } from './pages/customer-signup/customer-signup.component';


const authRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'inscription', component: CustomerSignupComponent }
]


@NgModule({
  declarations: [
    LoginComponent,
    CustomerSignupComponent
  ],
  imports: [
    CommonModule,
    NgIf,
    ReactiveFormsModule,
    RouterModule.forChild(authRoutes)
  ]
})
export class CustomerAuthenticationModule { }
