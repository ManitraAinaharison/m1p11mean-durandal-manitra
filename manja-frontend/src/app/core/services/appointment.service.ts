import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, shareReplay, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  Appointment,
  DateInterval,
  DateIntervalDetails,
  PostAppointmentResponse,
  PostAppointment,
} from '../models/appointment.model';
import { SubServiceModel } from '../models/salon-service.model';
import dayjs, { Dayjs } from 'dayjs';
import {
  createDateIntervalDetail,
  createDateIntervalDetail2,
  toSameDay,
  toTheSameDate,
} from '../util/date.util';
import { Employee } from '../models/user.model';
import { ApiResponse } from '../models/api.model';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  DEFAULT_SUBSERVICE_DURATION = 60; // minutes
  DEFAULT_OPENING_HOUR = 8;
  DEFAULT_CLOSING_HOUR = 17;

  private insertedAppointment =
    new BehaviorSubject<PostAppointmentResponse | null>(null);
  private selectedSubService = new BehaviorSubject<SubServiceModel | null>(
    null
  );
  private enablePostAppointment = new BehaviorSubject<boolean>(false);
  private selectedEmployee = new BehaviorSubject<Employee | null>(null);
  private businessHours = new BehaviorSubject<DateInterval | null>({
    start: dayjs()
      .hour(this.DEFAULT_OPENING_HOUR)
      .minute(0)
      .second(0)
      .millisecond(0),
    end: dayjs()
      .hour(this.DEFAULT_CLOSING_HOUR)
      .minute(0)
      .second(0)
      .millisecond(0),
  });
  private nonAvailableHours = new BehaviorSubject<DateInterval[]>([]);
  private referenceDate = new BehaviorSubject<Dayjs>(
    dayjs().date(1).hour(0).minute(0).second(0).millisecond(0)
  );
  private selectedDate = new BehaviorSubject<DateIntervalDetails>(
    createDateIntervalDetail(
      dayjs()
        .hour(this.DEFAULT_OPENING_HOUR)
        .minute(0)
        .second(0)
        .millisecond(0),
      dayjs()
        .hour(this.DEFAULT_OPENING_HOUR)
        .minute(0)
        .second(0)
        .millisecond(0),
      dayjs()
        .hour(this.DEFAULT_CLOSING_HOUR)
        .minute(0)
        .second(0)
        .millisecond(0),
      this.DEFAULT_SUBSERVICE_DURATION
    )
  );

  selectedEmployee$ = this.selectedEmployee.asObservable();
  selectedSubService$ = this.selectedSubService.asObservable();
  referenceDate$ = this.referenceDate.asObservable();
  selectedDate$ = this.selectedDate.asObservable();
  businessHours$ = this.businessHours.asObservable();
  nonAvailableHours$ = this.nonAvailableHours.asObservable();
  insertedAppointment$ = this.insertedAppointment.asObservable();
  enablePostAppointment$ = this.enablePostAppointment.asObservable();

  constructor(private readonly http: HttpClient) {}

  setSelectedSubService(selected: SubServiceModel | null) {
    this.selectedSubService.next(selected);
  }

  setNonAvailableHours(nonAvailableHours: DateInterval[]) {
    this.nonAvailableHours.next(nonAvailableHours);
  }

  getSelectedDateValue(): DateInterval {
    return this.selectedDate.value;
  }

  setBusinessHours(businessHours: DateInterval | null) {
    if (!businessHours) {
      // this.selectedDate.next(null);
      this.businessHours.next(null);
      return;
    }
    const selectedDate = this.getSelectedDateValue().start;
    businessHours.start = toSameDay(dayjs(businessHours.start), selectedDate);
    businessHours.end = toSameDay(dayjs(businessHours.end), selectedDate);
    this.businessHours.next(businessHours);
  }

  updateReferenceDate(value: Dayjs): void {
    this.referenceDate.next(value);
  }

  updateSelectedDate(value: Dayjs): void {
    if (this.businessHours.value) {
      const updatedBusinessHours = {
        start: toTheSameDate(value, this.businessHours.value.start),
        end: toTheSameDate(value, this.businessHours.value.end),
      };

      this.businessHours.next({
        start: value
          .hour(updatedBusinessHours.start.hour())
          .minute(updatedBusinessHours.start.minute())
          .second(0)
          .millisecond(0),
        end: value
          .hour(updatedBusinessHours.end.hour())
          .minute(updatedBusinessHours.end.minute())
          .second(0)
          .millisecond(0),
      });

      this.selectedDate.next(
        createDateIntervalDetail2(
          {
            start: value,
            end: value.add(
              this.selectedSubService.value
                ? this.selectedSubService.value.duration
                : this.DEFAULT_SUBSERVICE_DURATION,
              'minute'
            ),
          },
          updatedBusinessHours
        )
      );
    } else {
      this.selectedDate.next({
        start: value,
        end: value,
        dailyPercentage: 0,
        duration: 0,
        percentageStart: 0,
        percentageEnd: 0,
      });
    }
  }

  getReferenceDate() {
    return this.referenceDate$;
  }

  setSelectedEmployee(employee: Employee | null): void {
    this.selectedEmployee.next(employee);
  }

  checkEnablePostAppointment(): void {
    this.enablePostAppointment.next(
      !!(
        !this.insertedAppointment.value &&
        this.selectedSubService.value &&
        this.selectedEmployee.value &&
        this.selectedDate.value &&
        this.businessHours.value !== null
      )
    );
  }

  postAppointment(): Observable<ApiResponse<PostAppointmentResponse>> {
    if (!this.selectedSubService.value || !this.selectedEmployee.value?._id)
      throw Error(
        'not implemented yet : Veuillez sélectionnez une offre et un employé'
      );
    const appointment: PostAppointment = {
      appointmentDate: this.selectedDate.value.start.toDate(),
      employeeId: this.selectedEmployee.value._id,
      subServiceSlug: this.selectedSubService.value.slug,
    };

    const res = this.http
      .post<ApiResponse<PostAppointmentResponse>>(
        `/v1/appointments`,
        appointment
      )
      .pipe(
        tap({
          next: (response) => {
            console.log(response);
            this.insertedAppointment.next(response.payload);
            this.enablePostAppointment.next(false);
            // redirect to acceuil
          },
          error: (e) => {
            console.log(e);
            throw Error('not implemented yet');
          },
        }),
        shareReplay(1)
      );
    res.subscribe(
      (response) => {},
      (error) => console.log('error', error)
    );
    return res;
  }
}
