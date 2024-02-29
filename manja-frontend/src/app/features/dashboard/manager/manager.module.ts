import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeCrudComponent } from './pages/employee-crud/employee-crud.component';
import { ServiceCrudComponent } from './pages/service-crud/service-crud.component';
import { ListEmployeesComponent } from './components/list-employees/list-employees.component';
import { RouterModule, Routes } from '@angular/router';
import { ListServicesComponent } from './components/list-services/list-services.component';
import { EditServiceComponent } from './modals/edit-service/edit-service.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTreeModule} from '@angular/material/tree';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { ReactiveFormsModule } from '@angular/forms';
import { EditEmployeeComponent } from './modals/edit-employee/edit-employee.component';
import { TreeCheckboxComponent } from '../../../shared/components/tree-checkbox/tree-checkbox.component';
import { TreeViewModule } from '@progress/kendo-angular-treeview';
import { StatsComponent } from './pages/stats/stats.component';
import { ProfitCalculationComponent } from './pages/profit-calculation/profit-calculation.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { AverageEmployeeWorkingHoursComponent } from './components/average-employee-working-hours/average-employee-working-hours.component';
import { BookingLineChartComponent } from './components/booking-line-chart/booking-line-chart.component';
import { SalesComponent } from './components/sales/sales.component';
import { EmployeeProfileComponent } from './pages/employee-profile/employee-profile.component';
import { EmployeeInformationsComponent } from './components/employee-informations/employee-informations.component';
import { EmployeeSchedulesComponent } from './components/employee-schedules/employee-schedules.component';
import { EmployeeSchedulesUpdateComponent } from './modals/employee-schedules-update/employee-schedules-update.component';
import { EmployeeInformationsUpdateComponent } from './modals/employee-informations-update/employee-informations-update.component';
import { employeeGuard } from '../../../core/guards/auth.guard';
import { ListEbitComponent } from './components/list-ebit/list-ebit.component';
import { EditEbitComponent } from './modals/edit-ebit/edit-ebit.component';

const managerRoutes: Routes = [
  { path: 'profile', component: EmployeeProfileComponent, canActivate: [employeeGuard]},
  { path: 'employees', component: EmployeeCrudComponent },
  { path: 'services', component: ServiceCrudComponent },
  { path: 'statistiques', component: StatsComponent },
  { path: 'calcul-des-benefices', component: ProfitCalculationComponent }
];

@NgModule({
  declarations: [
    EmployeeCrudComponent,
    ServiceCrudComponent,
    ListEmployeesComponent,
    ListServicesComponent,
    EditServiceComponent,
    EditEmployeeComponent,
    TreeCheckboxComponent,
    StatsComponent,
    ProfitCalculationComponent,
    AverageEmployeeWorkingHoursComponent,
    BookingLineChartComponent,
    SalesComponent,
    EmployeeProfileComponent,
    EmployeeInformationsComponent,
    EmployeeSchedulesComponent,
    EmployeeSchedulesUpdateComponent,
    EmployeeInformationsUpdateComponent,
    ListEbitComponent,
    EditEbitComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatTreeModule,
    TreeViewModule,
    NgApexchartsModule,
    NgxDropzoneModule,
    ReactiveFormsModule,
    RouterModule.forChild(managerRoutes)
  ]
})
export class ManagerModule { }
