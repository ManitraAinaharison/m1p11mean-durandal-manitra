import { Component, ElementRef, HostListener, SimpleChanges, ViewChild } from '@angular/core';
import { AppointmentService } from '../../../../../core/services/appointment.service';
import dayjs from 'dayjs';

@Component({
  selector: 'app-employee-daily-tasks',
  templateUrl: './employee-daily-tasks.component.html',
  styleUrl: './employee-daily-tasks.component.css',
})
export class EmployeeDailyTasksComponent {
  currentDate = dayjs()

  constructor(private appointmentService: AppointmentService) {}

  ngOnInit(): void {

  }

  
}
