import { Component } from '@angular/core';
import { AppointmentService } from '../../../../../core/services/appointment.service';
import { AppointmentHistory } from '../../../../../core/models/appointment.model';

@Component({
  selector: 'app-my-appointments',
  templateUrl: './my-appointments.component.html',
  styleUrl: './my-appointments.component.css',
})
export class MyAppointmentsComponent {
  appointmentsHistory: AppointmentHistory[] | null = null;

  constructor(private appointmentService: AppointmentService) {}

  ngOnInit(): void {
    this.appointmentService.getAppointmentsHistory().subscribe((response) => {
      this.appointmentsHistory = response.payload;
    });
  }
}
