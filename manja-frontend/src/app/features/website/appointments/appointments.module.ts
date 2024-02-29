import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyAppointmentsComponent } from './pages/my-appointments/my-appointments.component';
import { SharedPipesModule } from "../../../shared/pipes/shared-pipes.module";
import { MyAppointmentDetailsComponent } from './pages/appointment-details/my-appointment-details.component';

const serviceRoutes: Routes = [
  { path: 'mes-rendez-vous', component: MyAppointmentsComponent },
  {
    path: 'mes-rendez-vous/:appointmentId/details',
    component: MyAppointmentDetailsComponent,
  },
];

@NgModule({
  declarations: [MyAppointmentsComponent, MyAppointmentDetailsComponent],
  imports: [
    CommonModule,
    SharedPipesModule,
    RouterModule.forChild(serviceRoutes),
  ],
})
export class AppointmentModule {}
