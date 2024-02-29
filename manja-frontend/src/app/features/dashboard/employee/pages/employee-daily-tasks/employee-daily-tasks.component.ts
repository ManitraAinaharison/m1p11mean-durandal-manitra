import { Component, ElementRef, HostListener, SimpleChanges, ViewChild } from '@angular/core';
import { AppointmentService } from '../../../../../core/services/appointment.service';
import dayjs from 'dayjs/esm';
import { DailyTasksDetails } from '../../../../../core/models/appointment.model';

@Component({
  selector: 'app-employee-daily-tasks',
  templateUrl: './employee-daily-tasks.component.html',
  styleUrl: './employee-daily-tasks.component.css',
})
export class EmployeeDailyTasksComponent {
  dailyTaskDate = dayjs(); // by default and should be current date
  dailyTaskDetails : DailyTasksDetails | null = null;

  constructor(private appointmentService: AppointmentService) {}

  ngOnInit(): void {
    this.appointmentService.getAppointmentDailyTasks().subscribe((response)=>{
      this.dailyTaskDetails = response.payload
    })
  }
}
