import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '../../../core/guards/auth.guard';
import { DatePickerComponent } from '../../../shared/components/datepicker/datepicker.component';
import { ServiceCardComponent } from '../../../shared/components/service-card/service-card.component';
import { TimepickerComponent } from '../../../shared/components/timepicker/timepicker.component';
import { DetailsServiceComponent } from './pages/details-service/details-service.component';
import { ListServicesComponent } from './pages/list-services/list-services.component';
import { ReservationComponent } from './pages/reservation/reservation.component';
import { SharedDatePickerModule } from '../../../shared/shared-datepicker.module';
import { SharedPipesModule } from '../../../shared/pipes/shared-pipes.module';

const serviceRoutes: Routes = [
  { path: 'services', component: ListServicesComponent },
  {
    path: 'services/:sub-service-slug',
    component: DetailsServiceComponent,
  },
  {
    path: 'services/:sub-service-slug/reservation',
    component: ReservationComponent,
    canActivate: [authGuard],
  },
];

@NgModule({
  declarations: [
    ListServicesComponent,
    DetailsServiceComponent,
    ServiceCardComponent,
    ReservationComponent,
    TimepickerComponent,
  ],
  imports: [
    CommonModule,
    SharedDatePickerModule,
    DragDropModule,
    SharedPipesModule,
    RouterModule.forChild(serviceRoutes),
  ],
})
export class ServiceModule {}
