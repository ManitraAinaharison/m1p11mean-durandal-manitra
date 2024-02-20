import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeModule } from './home/home.module';
import { CustomerAuthenticationModule } from './customer-authentication/customer-authentication.module';
import { ServiceModule } from './service/service.module';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CustomerAuthenticationModule,
    HomeModule,
    ServiceModule
  ],
  exports: [RouterModule]
})
export class WebsiteModule { }
