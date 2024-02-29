import { Component } from '@angular/core';
import { AppointmentService } from '../../../../../core/services/appointment.service';
import {
  Appointment,
  GetAppointment,
} from '../../../../../core/models/appointment.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-my-appointment-details',
  templateUrl: './my-appointment-details.component.html',
  styleUrl: './my-appointment-details.component.css',
})
export class MyAppointmentDetailsComponent {
  appointmentSlug: string | null = null;
  appointment: GetAppointment | null = null;
  appointmentNotFound: boolean = false;
  enablePayment: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private appointmentService: AppointmentService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      let slug: string | null = params.get('appointmentId');
      this.appointmentSlug = slug;
      if (slug === null) {
        this.appointmentNotFound = true;
      } else {
        this.appointmentService.getAppointment(slug).subscribe((response) => {
          this.appointment = response.payload;
          console.log(this.appointment)
        });
      }
    });

    this.appointmentService.appointment$.subscribe((response) => {
      this.appointment = response;
    });
  }

  pay() {
    this.appointmentService.payAppointment().subscribe((response) => {
      // afficher modal réussite
    });
  }
}
