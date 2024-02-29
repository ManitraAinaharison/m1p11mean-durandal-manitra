import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import dayjs, { Dayjs } from 'dayjs/esm';
import {
  DateInterval,
  DateIntervalDetails,
  PostAppointmentResponse,
} from '../../../../../core/models/appointment.model';
import {
  ServiceModel,
  SubServiceModel,
} from '../../../../../core/models/salon-service.model';
import { Employee } from '../../../../../core/models/user.model';
import { AppointmentService } from '../../../../../core/services/appointment.service';
import { EmployeeService } from '../../../../../core/services/employee.service';
import { SalonService } from '../../../../../core/services/salon-service.service';
import { SubServiceService } from '../../../../../core/services/subservice.service';
import {
  calculateBusinessHours,
  calculateNonAvailableHours,
  createDateIntervalDetail,
  getDiff,
  toDateIntervalDetails,
} from '../../../../../core/util/date.util';
import { CalendarDate } from '../../../../../shared/types/date.types';
import { toCalendarDate } from '../../../../../shared/utils/date.util';
import { PageLoaderService } from '../../../../../shared/services/page-loader.service';

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
  businessHours: DateInterval | null = { start: dayjs(), end: dayjs() };
  // businessHours: DateInterval = { start: dayjs(), end: dayjs() };
  disableTimePicker: boolean = false;
  enablePostAppointment: boolean = false;
  insertedAppointment: PostAppointmentResponse | null = null;

  loadingEmployees : boolean = false;
  loadingTimepicker : boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private salonService: SalonService,
    private appointmentService: AppointmentService,
    private subServiceService: SubServiceService,
    private employeeService: EmployeeService,
    private pageLoaderService: PageLoaderService
  ) {}

  ngOnInit(): void {
    this.pageLoaderService.show();
    this.route.paramMap.subscribe((params) => {
      this.pageLoaderService.hide();
      let slug: string | null = params.get('sub-service-slug');
      this.serviceSlug = slug;
      this.setMatchingService(slug);

      this.appointmentService.insertedAppointment$.subscribe((value) => {
        this.insertedAppointment = value;
      });

      this.appointmentService.enablePostAppointment$.subscribe((value) => {
        this.enablePostAppointment = value;
      });

      this.appointmentService.businessHours$.subscribe((businessHours) => {
        this.setBusinessHours(businessHours);
        this.appointmentService.nonAvailableHours$.subscribe(
          (nonAvailableHours) => {
            this.setNonAvailableHours(nonAvailableHours, businessHours);
          }
        );
      });
      this.appointmentService.referenceDate$.subscribe((value) => {
        this.setReferenceDate(value);
      });

      this.subServiceService.selectedSubService$.subscribe(
        (selectedSubService) => {
          this.setLoadingEmployees(true);
          this.appointmentService.checkEnablePostAppointment();
          this.selectedSubService = selectedSubService;
          this.subServiceService.getRelatedEmployees().subscribe((response) => {
            this.employees = response.payload;
            this.setSelectedEmployee(null);
            this.setLoadingEmployees(false);
          });
        }
      );

      this.appointmentService.selectedEmployee$.subscribe((employee) => {
        this.selectedEmployee = employee;
        if (!employee) return;
        this.update(employee, this.selectedDate);
      });

      this.appointmentService.selectedDate$.subscribe((date) => {
        const formerSelectedDate = this.selectedDate;
        this.selectedDate = date;
        if (this.selectedEmployee === null) {
          this.disableTimePicker = true;
          this.appointmentService.checkEnablePostAppointment();
          return;
        }
        if (formerSelectedDate.start.isSame(date.start, 'date')) return;
        this.update(this.selectedEmployee, date);
      });
    });
  }

  update(selectedEmployee: Employee, selectedDate: DateIntervalDetails) {
    this.setLoadingTimepicker(true);
    this.employeeService
      .getEmployeeSchedule(selectedEmployee._id, selectedDate.start)
      .subscribe({
        next: (response) => {
          this.setLoadingTimepicker(false);
          if (!response.payload) return;
          const newNonAvailableHours = calculateNonAvailableHours(
            response.payload
          );
          const newBusinessHours = calculateBusinessHours(response.payload);
          this.appointmentService.setNonAvailableHours(newNonAvailableHours);
          this.appointmentService.setBusinessHours(newBusinessHours);
          this.disableTimePicker = false;
          this.updateSelectedDateOnClik(
            selectedDate.start,
            newBusinessHours,
            toDateIntervalDetails(
              newNonAvailableHours,
              newBusinessHours.start,
              newBusinessHours.end
            )
          );
          this.appointmentService.checkEnablePostAppointment();
        },
        error: (err) => {
          this.setLoadingTimepicker(false);
          this.disableTimePicker = true;
          this.appointmentService.setBusinessHours(null);
          this.appointmentService.setNonAvailableHours([]);
          throw new Error('not implemented yet');
        },
      });
    this.appointmentService.checkEnablePostAppointment();
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
    businessHours: DateInterval | null
  ): void {
    if (businessHours === null) {
      this.nonAvailableHours = [];
      this.appointmentService.checkEnablePostAppointment();
      return;
      // if (nonAvailableHours.length > 0)
      //   this.appointmentService.setNonAvailableHours([]);
      // return;
    }
    this.nonAvailableHours = toDateIntervalDetails(
      nonAvailableHours,
      businessHours.start,
      businessHours.end
    );
    this.appointmentService.checkEnablePostAppointment();
  }

  setBusinessHours(value: DateInterval | null): void {
    this.businessHours = value;
  }

  setReferenceDate(value: Dayjs): void {
    this.referenceDate = value;
  }

  updateSelectedDatePicker(value: Dayjs[]): void {
    if (!value[0].isSame(this.selectedDate.start, 'date'))
      this.appointmentService.updateSelectedDate(value[0]);
  }

  updateSelectedDateTimepicker(value: Dayjs[]): void {
    this.appointmentService.updateSelectedDate(value[0]);
  }

  updateSelectedDateOnClik(
    value: Dayjs,
    businessHours: DateInterval,
    nonAvailableHours: DateIntervalDetails[]
  ) {
    const availableHours = this.findAvailableHours(
      businessHours,
      nonAvailableHours
    );
    if (
      this.selectedSubService &&
      availableHours.intervals.length > 0 &&
      (this.selectedSubService.duration <= availableHours.minDuration ||
        this.selectedSubService.duration <= availableHours.maxDuration)
    ) {
      this.appointmentService.updateSelectedDate(
        availableHours.intervals[0].start
      );
    }
    if (!this.selectedSubService) {
      this.appointmentService.updateSelectedDate(value);
      return;
    }
  }

  updateSelectedDateOnDrag() {}

  updateSelectedTimePicker(value: Dayjs[]): void {
    if (this.selectedSubService) {
      this.appointmentService.updateSelectedDate(value[0]);
    }
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

  setSelectedEmployee(employee: Employee | null): void {
    if (this.selectedEmployee === employee) return;
    this.appointmentService.setSelectedEmployee(employee);
  }

  findAvailableHours(
    businessHours: DateInterval,
    nonAvailableHours: DateIntervalDetails[]
  ): {
    minDuration: number;
    maxDuration: number;
    intervals: DateIntervalDetails[];
  } {
    if (nonAvailableHours.length === 0 || !this.selectedSubService) {
      const duration = getDiff(businessHours.start, businessHours.end);
      return {
        minDuration: duration,
        maxDuration: duration,
        intervals: [
          {
            start: businessHours.start,
            end: businessHours.end,
            duration,
            dailyPercentage: 100,
            percentageStart: 0,
            percentageEnd: 100,
          },
        ],
      };
    }
    const availableHours: DateInterval[] = [];
    let start = businessHours.start;
    let minDuration = 0;
    let maxDuration = 0;
    for (let index = 0; index < nonAvailableHours.length; index++) {
      const currentElement = nonAvailableHours[index];
      let durationDiff = getDiff(start, currentElement.start);

      if (durationDiff > 0) {
        availableHours.push({
          start,
          end: currentElement.start,
        });
        start = currentElement.end;

        if (durationDiff < minDuration || minDuration === 0)
          minDuration = durationDiff;
        if (durationDiff > maxDuration) maxDuration = durationDiff;
      }
      if (index !== nonAvailableHours.length - 1) continue;

      durationDiff = getDiff(start, businessHours.end);
      if (durationDiff > 0) {
        availableHours.push({
          start,
          end: businessHours.end,
        });
        if (durationDiff < minDuration || minDuration === 0)
          minDuration = durationDiff;
        if (durationDiff > maxDuration) maxDuration = durationDiff;
      }
    }
    return {
      minDuration,
      maxDuration,
      intervals: toDateIntervalDetails(
        availableHours,
        businessHours.start,
        businessHours.end
      ),
    };
  }

  createAppointment() {
    if (this.insertedAppointment !== null)
      throw new Error(
        'Not implemented yet : The reservation has already been done'
      );
    this.appointmentService
      .postAppointment()
      .subscribe((insertedAppointment) => {
        this.redirectToReservationDetailsPage(insertedAppointment.payload._id);
      })
      .unsubscribe();
  }

  redirectToReservationDetailsPage(appointmentId: string): void {
    this.router.navigate([`/mes-rendez-vous/${appointmentId}/details`]);
  }

  // ui
  setLoadingEmployees(value : boolean){
    this.loadingEmployees = value;
  }

  setLoadingTimepicker(value : boolean){
    this.loadingTimepicker = value;
  }
}
