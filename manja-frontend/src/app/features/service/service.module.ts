import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListServicesComponent } from './pages/list-services/list-services.component';
import { DetailsServiceComponent } from './pages/details-service/details-service.component';
import { RouterModule, Routes } from '@angular/router';


const serviceRoutes: Routes = [
  { path: 'services', component: ListServicesComponent },
  { path: 'services/:id', component: DetailsServiceComponent }
]


@NgModule({
  declarations: [
    ListServicesComponent,
    DetailsServiceComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(serviceRoutes)
  ]
})
export class ServiceModule { }
