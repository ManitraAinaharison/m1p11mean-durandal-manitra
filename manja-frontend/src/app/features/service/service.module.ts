import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListServicesComponent } from './pages/list-services/list-services.component';
import { DetailsServiceComponent } from './pages/details-service/details-service.component';
import { RouterModule, Routes } from '@angular/router';
import { ServiceCardComponent } from '../../shared/components/service-card/service-card.component';
import { ReservationComponent } from './pages/reservation/reservation.component';
import { DatePickerComponent } from '../../shared/components/datepicker/datepicker.component';
import { TimepickerComponent } from '../../shared/components/timepicker/timepicker.component';
import { CdkDrag, CdkDragHandle, CdkDropList, DragDropModule } from '@angular/cdk/drag-drop';


const serviceRoutes: Routes = [
  { path: 'services', component: ListServicesComponent },
  {
    path: 'services/:sub-service-slug',
    component: DetailsServiceComponent,
  },
  { path: 'services/:sub-service-slug/reservation', component: ReservationComponent },
];


@NgModule({
  declarations: [
    ListServicesComponent,
    DetailsServiceComponent,
    ServiceCardComponent,
    ReservationComponent,
    DatePickerComponent,
    TimepickerComponent,
  ],
  imports: [
    DragDropModule,
    CdkDrag,
    CdkDropList,
    CdkDragHandle,
    CommonModule,
    RouterModule.forChild(serviceRoutes),
  ],
})
export class ServiceModule {}
