import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeModule } from './home/home.module';
import { CustomerAuthenticationModule } from './customer-authentication/customer-authentication.module';
import { ServiceModule } from './service/service.module';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from '../../shared/components/not-found/not-found.component';
import { AppointmentModule } from './appointments/appointments.module';

const notFoundRoute: Routes = [
  {
    path: '**',
    component: NotFoundComponent,
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CustomerAuthenticationModule,
    HomeModule,
    ServiceModule,
    AppointmentModule,
    RouterModule.forChild(notFoundRoute)
  ],
  exports: [RouterModule]
})
export class WebsiteModule { }
