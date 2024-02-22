import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import dayjs, { Dayjs } from 'dayjs';
import {
  DateIntervalDetails,
  DateInterval,
} from '../../../../../core/models/appointment.model';
import {
  ServiceModel,
  SubServiceModel,
} from '../../../../../core/models/salon-service.model';
import { Employee } from '../../../../../core/models/user.model';
import { AppointmentService } from '../../../../../core/services/appointment.service';
import { EmployeeService } from '../../../../../core/services/employee.service';
import { SalonService } from '../../../../../core/services/salon-service.service';
import {
  createDateIntervalDetail,
  toDateIntervalDetails,
} from '../../../../../core/util/date.util';
import { CalendarDate } from '../../../../../shared/types/date.types';
import { toCalendarDate } from '../../../../../shared/utils/date.util';
import { SubServiceService } from '../../../../../core/services/subservice.service';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.css',
})
export class ReservationComponent {
  serviceSlug: string | null = null;
  matchingService: ServiceModel | null = null;
  selectedSubService: SubServiceModel | null = null;
  selectedEmployee: Employee | null = null;
  employees: Employee[] | null = null;
  nonAvailableHours: DateIntervalDetails[] = [];
  referenceDate: Dayjs = dayjs().date(1); // default value
  selectedDate: DateIntervalDetails = createDateIntervalDetail(
    dayjs(),
    dayjs(),
    dayjs().add(15, 'minute'),
    15
  ); // default value
  openingHour: number = 9;
  closingHour: number = 17;
  businessHours: DateInterval = { start: dayjs(), end: dayjs() };
  disableTimePicker: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private salonService: SalonService,
    private appointmentService: AppointmentService,
    private subServiceService: SubServiceService,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      let slug: string | null = params.get('sub-service-slug');
      this.serviceSlug = slug;
      this.setMatchingService(slug);

      this.appointmentService.businessHours$.subscribe((value) => {
        this.setBusinessHours(value);
      });
      this.appointmentService.referenceDate$.subscribe((value) => {
        this.setReferenceDate(value);
      });
      
      this.subServiceService.selectedSubService$.subscribe(
        (selectedSubService) => {
          this.selectedSubService = selectedSubService;
          this.subServiceService.getRelatedEmployees().subscribe((response) => {
            this.employees = response.payload;
          });
        }
      );

      this.appointmentService.selectedEmployee$.subscribe((employee) => {
        this.selectedEmployee = employee;
        if (!employee) return;
        this.employeeService
          .getEmployeeSchedule(employee._id, this.selectedDate.start)
          .subscribe({
            next: (response) => {
              if (!response.payload) return;
              this.appointmentService.setNonAvailableHours(
                response.payload.unavailableSchedules
              );
              this.appointmentService.setBusinessHours(
                response.payload.workSchedules[0]
              );
              this.disableTimePicker = false;
            },
            error: (err) => {
              this.disableTimePicker = true;
              throw new Error('not implemented yet')
            },
          });
      });

      this.appointmentService.selectedDate$.subscribe((date) => {
        const formerSelectedDate = this.selectedDate;
        this.selectedDate = date;
        if (this.selectedEmployee === null) {
          this.disableTimePicker = true;
          return;
        }
        if (formerSelectedDate.start.isSame(date.start, 'date')) return;
        this.employeeService
          .getEmployeeSchedule(
            this.selectedEmployee._id,
            this.selectedDate.start
          )
          .subscribe({
            next: (response) => {
              if (!response.payload) return;
              this.appointmentService.setNonAvailableHours(
                response.payload.unavailableSchedules
              );
              this.appointmentService.setBusinessHours(
                response.payload.workSchedules[0]
              );
              this.disableTimePicker = false;
            },
            error: (err) => {
              this.disableTimePicker = true;
              throw Error('not implemented yet');
            },
          });
      });
    });
  }

  setMatchingService(slug: string | null) {
    if (!slug) return;
    this.salonService
      .getService(slug)
      .subscribe((response) => (this.matchingService = response.payload)); // handle if getSubService returns null
  }

  getEmployees() {
    this.employeeService.getEmployees();
  }

  setEmployees(value: Employee[]): void {
    this.employees = value;
  }

  setSelectedSubService(selected: SubServiceModel): void {
    if (this.selectedSubService === selected) return;
    this.appointmentService.setSelectedSubService(selected);
    this.subServiceService.setSelectedSubService(selected);
  }

  setNonAvailableHours(
    nonAvailableHours: DateInterval[],
    businessHours: DateInterval
  ): void {
    this.nonAvailableHours = toDateIntervalDetails(
      nonAvailableHours,
      businessHours.start,
      businessHours.end
    );
  }

  setBusinessHours(value: DateInterval): void {
    this.businessHours = value;
  }

  setReferenceDate(value: Dayjs): void {
    this.referenceDate = value;
  }

  updateSelectedDate(value: Dayjs[]): void {
    this.appointmentService.updateSelectedDate(value[0]);
  }

  updateReferenceDate(value: Dayjs): void {
    this.appointmentService.updateReferenceDate(value);
  }

  selectedDateToCalendarFormat(): CalendarDate {
    return toCalendarDate(this.selectedDate.start, {
      month: this.referenceDate.month(),
      openDays: [],
      selected: true,
    });
  }

  setSelectedEmployee(employee: Employee): void {
    if (this.selectedEmployee === employee) return;
    this.appointmentService.setSelectedEmployee(employee);
  }
}
