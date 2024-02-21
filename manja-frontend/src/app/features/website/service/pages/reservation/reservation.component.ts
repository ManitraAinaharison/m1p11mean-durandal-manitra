import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import dayjs, { Dayjs } from 'dayjs';
import { DateIntervalDetails, DateInterval } from '../../../../../core/models/appointment.model';
import { ServiceModel, SubService } from '../../../../../core/models/salon-service.model';
import { Employee } from '../../../../../core/models/user.model';
import { AppointmentService } from '../../../../../core/services/appointment.service';
import { EmployeeService } from '../../../../../core/services/employee.service';
import { SalonService } from '../../../../../core/services/salon-service.service';
import { toDateIntervalDetails } from '../../../../../core/util/date.util';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.css',
})
export class ReservationComponent {
  serviceSlug: string | null = null;
  matchingService: ServiceModel | null = null;
  selectedSubService: SubService | null = null;
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

  constructor(
    private route: ActivatedRoute,
    private salonService: SalonService,
    private appointmentService: AppointmentService,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      let slug: string | null = params.get('sub-service-slug');
      this.serviceSlug = slug;
      this.setMatchingService(slug);

      this.selectedSubService;
      this.employeeService.getEmployees().subscribe((employeeList) => {
        this.setEmployees(employeeList);
      });
      this.appointmentService.referenceDate$.subscribe((date) => {
        this.referenceDate = date;
      });
      this.appointmentService.selectedDate$.subscribe((date) => {
        this.selectedDate = date;
        this.appointmentService
          .getNonAvailableHours(this.selectedDate.start)
          .subscribe((response) => {
            this.setNonAvailableHours(
              response.nonAvailableHours,
              response.businessHours
            );
            this.setBusinessHours(response.businessHours);
          });
      });
    });
  }

  setMatchingService(slug: string | null) {
    if (!slug) return;
    this.salonService
      .getService(slug)
      .subscribe((service) => (this.matchingService = service)); // handle if getSubService returns null
  }

  getEmployees() {
    this.employeeService.getEmployees();
  }

  setEmployees(value: Employee[]): void {
    this.employees = value;
  }

  setSelectedSubService(selected: SubService): void {
    this.selectedSubService = selected;
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
}
