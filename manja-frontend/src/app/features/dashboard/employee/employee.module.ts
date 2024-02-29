import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeAppointmentsComponent } from './pages/employee-appointments/employee-appointments.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedDatePickerModule } from '../../../shared/shared-datepicker.module';
import { SharedPipesModule } from '../../../shared/pipes/shared-pipes.module';
import { EmployeeDailyTasksComponent } from './pages/employee-daily-tasks/employee-daily-tasks.component';
import { employeeGuard } from '../../../core/guards/auth.guard';

const employeeRoutes: Routes = [
  {
    path: 'employee-appointments',
    component: EmployeeAppointmentsComponent,
    canActivate: [employeeGuard],
  },
  {
    path: 'employee-daily-tasks',
    component: EmployeeDailyTasksComponent,
    canActivate: [employeeGuard],
  },
];

@NgModule({
  declarations: [EmployeeAppointmentsComponent, EmployeeDailyTasksComponent],
  imports: [
    CommonModule,
    SharedDatePickerModule,
    SharedPipesModule,
    RouterModule.forChild(employeeRoutes),
  ],
})
export class EmployeeModule {}
