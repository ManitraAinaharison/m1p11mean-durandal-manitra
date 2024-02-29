import { Component } from '@angular/core';
import { AppointmentService } from '../../../../../core/services/appointment.service';
import { AppointmentHistory } from '../../../../../core/models/appointment.model';
import { PageLoaderService } from '../../../../../shared/services/page-loader.service';

@Component({
  selector: 'app-my-appointments',
  templateUrl: './my-appointments.component.html',
  styleUrl: './my-appointments.component.css',
})
export class MyAppointmentsComponent {
  appointmentsHistory: AppointmentHistory[] | null = null;

  constructor(
    private appointmentService: AppointmentService,
    private pageLoaderService: PageLoaderService
  ) {}

  ngOnInit(): void {
    this.pageLoaderService.show();
    this.appointmentService.getAppointmentsHistory().subscribe((response) => {
      this.appointmentsHistory = response.payload;
      this.pageLoaderService.hide();
    });
  }
}
