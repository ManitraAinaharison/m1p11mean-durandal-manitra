import { Injectable } from '@angular/core';
import { BehaviorSubject, of, shareReplay, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  Appointment,
  DateInterval,
  DateIntervalDetails,
} from '../models/appointment.model';
import { SubServiceModel } from '../models/salon-service.model';
import dayjs, { Dayjs } from 'dayjs';
import { mockupFindNonAvailableHours } from './api-mock-data/appointment.mockdata';
import { createDateIntervalDetail } from '../util/date.util';
import { Employee } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  DEFAULT_SUBSERVICE_DURATION = 60; // minutes
  OPENING_HOUR = 8;
  CLOSING_HOUR = 17;

  private appointment = new BehaviorSubject<Appointment[] | null>(null);
  private selectedSubService = new BehaviorSubject<SubServiceModel | null>(
    null
  );
  private selectedEmployee = new BehaviorSubject<Employee | null>(null);
  private businessHours = new BehaviorSubject<DateInterval>({
    start: dayjs(),
    end: dayjs(),
  });
  private nonAvailableHours = new BehaviorSubject<DateInterval[]>([]);
  private referenceDate = new BehaviorSubject<Dayjs>(
    dayjs().date(1).hour(0).minute(0).second(0).millisecond(0)
  );
  private selectedDate = new BehaviorSubject<DateIntervalDetails>(
    createDateIntervalDetail(
      dayjs()
        .hour(this.CLOSING_HOUR)
        .minute(0)
        .second(0)
        .millisecond(0)
        .subtract(this.DEFAULT_SUBSERVICE_DURATION, 'minute'),
      dayjs().hour(this.OPENING_HOUR).minute(0).second(0).millisecond(0),
      dayjs().hour(this.CLOSING_HOUR).minute(0).second(0).millisecond(0),
      this.DEFAULT_SUBSERVICE_DURATION
    )
  );

  selectedEmployee$ = this.selectedEmployee.asObservable();
  selectedSubService$ = this.selectedSubService.asObservable();
  referenceDate$ = this.referenceDate.asObservable();
  selectedDate$ = this.selectedDate.asObservable();
  businessHours$ = this.businessHours.asObservable();

  constructor(private readonly http: HttpClient) {}

  setSelectedSubService(selected: SubServiceModel | null) {
    this.selectedSubService.next(selected);
  }

  getNonAvailableHours(date: Dayjs) {
    // return this.http.get<Appointment[]>('/appointments/non-available/${date}').pipe(
    return of(mockupFindNonAvailableHours(date)).pipe(
      tap({
        next: (response) => {
          this.setNonAvailableHours(response.nonAvailableHours);
          this.setBusinessHours(response.businessHours);
        },
        error: () => {
          throw Error('not implemented yet');
        },
      }),
      shareReplay(1)
    );
  }

  setNonAvailableHours(nonAvailableHours: DateInterval[]) {
    this.nonAvailableHours.next(nonAvailableHours);
  }

  getSelectedDateValue(): DateInterval{
    return this.selectedDate.value;
  }

  setBusinessHours(businessHours: DateInterval) {
    const selectedDate = this.getSelectedDateValue().start;
    businessHours.start = this.toSameDay(dayjs(businessHours.start), selectedDate)
    businessHours.end = this.toSameDay(dayjs(businessHours.end), selectedDate)
    this.businessHours.next(businessHours);
  }

  toSameDay(value: Dayjs, referenceDate : Dayjs): Dayjs{
    return referenceDate.hour(value.hour()).minute(value.minute());
  }

  updateReferenceDate(value: Dayjs): void {
    this.referenceDate.next(value);
  }

  updateSelectedDate(value: Dayjs): void {
    this.businessHours.next({
      start: value.hour(this.OPENING_HOUR).minute(0).second(0).millisecond(0),
      end: value.hour(this.CLOSING_HOUR).minute(0).second(0).millisecond(0),
    });
    this.selectedDate.next(
      createDateIntervalDetail(
        value,
        value.hour(this.OPENING_HOUR).minute(0).second(0).millisecond(0),
        value.hour(this.CLOSING_HOUR).minute(0).second(0).millisecond(0),
        this.DEFAULT_SUBSERVICE_DURATION
      )
    );
  }

  getReferenceDate() {
    return this.referenceDate$;
  }

  setSelectedEmployee(employee: Employee): void {
    this.selectedEmployee.next(employee);
  }
}
