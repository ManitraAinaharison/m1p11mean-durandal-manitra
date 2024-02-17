import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SalonService } from '../../../../core/services/salon-service.service';
import {
  ServiceModel,
  SubService,
} from '../../../../core/models/salon-service.model';
import { AppointmentService } from '../../../../core/services/appointment.service';
import { EmployeeService } from '../../../../core/services/employee.service';
import { Employee } from '../../../../core/models/user.model';
import dayjs, { Dayjs } from 'dayjs';
import {
  DateInterval,
  DateIntervalDetails,
} from '../../../../core/models/appointment.model';
import { toDateIntervalDetails } from '../../../../core/util/date.util';

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
  referenceDate: Dayjs = dayjs();
  openingHour: number = 9;
  closingHour: number = 17;

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
    });
    this.employeeService.getEmployees().subscribe((employeeList) => {
      this.setEmployees(employeeList);
    });
    this.appointmentService
      .getNonAvailableHours(this.referenceDate)
      .subscribe((hours) => {
        this.setNonAvailableHours(hours);
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

  setNonAvailableHours(hours: DateInterval[]): void {
    this.nonAvailableHours = toDateIntervalDetails(
      hours,
      this.referenceDate.hour(this.openingHour).minute(0).second(0).millisecond(0),
      this.referenceDate.hour(this.closingHour).minute(0).second(0).millisecond(0)
      );
      console.log(this.nonAvailableHours)
  }
}
