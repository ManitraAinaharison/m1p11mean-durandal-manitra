import { Component, ElementRef, HostListener, SimpleChanges, ViewChild } from '@angular/core';
import { AppointmentService } from '../../../../../core/services/appointment.service';
import dayjs, { Dayjs } from 'dayjs/esm';
import {
  AppointmentDetails, DateIntervalDetails,
} from '../../../../../core/models/appointment.model';
import { CalendarDate } from '../../../../../shared/types/date.types';
import { toCalendarDate, toCalendarDates } from '../../../../../shared/utils/date.util';
import { createDateIntervalDetail } from '../../../../../core/util/date.util';

@Component({
  selector: 'app-employee-appointments',
  templateUrl: './employee-appointments.component.html',
  styleUrl: './employee-appointments.component.css',
})
export class EmployeeAppointmentsComponent {
  //   referenceDate: Dayjs | null = null;
  loading: boolean = false;
  appointments: AppointmentDetails[] | null = null;
  monthReferenceDate: Dayjs = dayjs().date(1); // default value
  selectedDates: CalendarDate[] = [];
  selectedDate: DateIntervalDetails = createDateIntervalDetail(
    dayjs(),
    dayjs(),
    dayjs().add(15, 'minute'),
    15
  );
  selectedAppointment: AppointmentDetails | null = null;
  currentTooltip: number | null = null;

  @ViewChild('appointmentArrayRef') appointmentArrayRef: ElementRef | undefined;
  appointmentArrayWidth: number = -1;

  constructor(private appointmentService: AppointmentService) {}

  ngOnInit(): void {
    this.appointmentService.updateReferenceDate(dayjs());
    this.appointmentService.selectedDate$.subscribe((selectedDate) => {
      this.selectedDate = selectedDate;
      this.selectedAppointment = null;
      this.appointmentService.getAppointments().subscribe((response) => {
        this.appointments = response.payload;
        this.selectedAppointment = null;
        this.loading = false;
      });
    });

    this.appointmentService.appointmentList$.subscribe((appointmentList)=>{
      this.appointments = appointmentList;
      this.setLoading(false);
    })
  }

  updateMonthReferenceDate(value: Dayjs): void {
    if (this.monthReferenceDate.isSame(value, 'month')) return;
    this.appointmentService.updateReferenceDate(value);
  }

  updateSelectedDate(value: Dayjs[]): void {
    if (value.length === 0) return;
    this.setLoading(true)
    this.appointmentService.updateSelectedDate(value[0]);
  }

  setSelectedAppointment(appointment: AppointmentDetails) {
    this.selectedAppointment = appointment;
  }

  validateAppointmentDone(appointment: AppointmentDetails) {
    this.setLoading(true)
    this.showTooltip(null);
    this.appointmentService.validateAppointmentDone(appointment)
    .subscribe(()=>{
      this.setLoading(false);
    });
  }

  cancelAppointment(appointment: AppointmentDetails) {
    this.setLoading(true)
    this.showTooltip(null);
    this.appointmentService.cancelAppointment(appointment)
    .subscribe(()=>{
      this.setLoading(false);
    });
  }

  // styles
  /**
   * returns -1 if the appointmentArrayRef is undefined
   */
  getAppointmentArrayWidth(): number {
    return (this.appointmentArrayWidth =
      this.appointmentArrayRef === undefined
        ? -1
        : this.appointmentArrayRef.nativeElement.offsetWidth);
  }

  showTooltip(value: number | null) {
    if (value === null) this.currentTooltip = null;
    else if (value === this.currentTooltip) this.currentTooltip = null;
    else if (this.appointments && value <= this.appointments.length) {
      this.currentTooltip = value;
    }
    console.log(this.currentTooltip);
  }

  handleClickOutside() {
    console.log('clicked outside');
  }

  setLoading(value: boolean): void {
    this.loading = value;
  }
}
