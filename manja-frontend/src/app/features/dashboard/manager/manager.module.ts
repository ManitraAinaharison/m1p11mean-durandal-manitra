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

const managerRoutes: Routes = [
  { path: 'employees', component: ListEmployeesComponent },
  { path: 'services', component: ListServicesComponent }
];

@NgModule({
  declarations: [
    EmployeeCrudComponent,
    ServiceCrudComponent,
    ListEmployeesComponent,
    ListServicesComponent,
    EditServiceComponent,
    EditEmployeeComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatTreeModule,
    NgxDropzoneModule,
    ReactiveFormsModule,
    RouterModule.forChild(managerRoutes)
  ]
})
export class ManagerModule { }
