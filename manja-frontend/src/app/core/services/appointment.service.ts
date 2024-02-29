import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, shareReplay, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  Appointment,
  DateInterval,
  DateIntervalDetails,
  PostAppointmentResponse,
  PostAppointment,
  AppointHistoryResponse,
  AppointmentHistory,
  GetAppointment,
  GetAppointmentResponse,
  PutAppointmentResponse,
  PutAppointment,
  AppointmentDetails,
  AppointmentDetailsResponse,
  DailyTasksDetailsResponse,
  DailyTasksDetails,
} from '../models/appointment.model';
import { SubServiceModel } from '../models/salon-service.model';
import dayjs, { Dayjs } from 'dayjs/esm';
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

  private appointmentsHistory = new BehaviorSubject<
    AppointmentHistory[] | null
  >(null);
  private appointment = new BehaviorSubject<GetAppointment | null>(null);
  private appointmentList = new BehaviorSubject<AppointmentDetails[] | null>(
    null
  );
  //daily appointment date
  private dailyTaskDate = new BehaviorSubject<Dayjs>(dayjs());
  private dailyTaskDetails = new BehaviorSubject<DailyTasksDetails | null>(
    null
  );

  selectedEmployee$ = this.selectedEmployee.asObservable();
  selectedSubService$ = this.selectedSubService.asObservable();
  referenceDate$ = this.referenceDate.asObservable();
  selectedDate$ = this.selectedDate.asObservable();
  businessHours$ = this.businessHours.asObservable();
  nonAvailableHours$ = this.nonAvailableHours.asObservable();
  insertedAppointment$ = this.insertedAppointment.asObservable();
  enablePostAppointment$ = this.enablePostAppointment.asObservable();
  //employee appointments
  appointmentsHistory$ = this.appointmentsHistory.asObservable();
  appointment$ = this.appointment.asObservable();
  appointmentList$ = this.appointmentList.asObservable();
  //employee daily appointment tasks details
  dailyTaskDate$ = this.dailyTaskDate.asObservable();
  dailyTaskDetails$ = this.dailyTaskDetails.asObservable();

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

  getAppointmentsHistory(): Observable<ApiResponse<AppointmentHistory[]>> {
    return this.http
      .get<ApiResponse<AppointHistoryResponse[]>>(`/v1/appointments/history`)
      .pipe(
        map((response): ApiResponse<AppointmentHistory[]> => {
          return {
            ...response,
            payload: response.payload.map((appointmentHistory) => {
              const appointmentDate = dayjs(appointmentHistory.appointmentDate);
              const duration = appointmentHistory.duration / 60;
              return {
                ...appointmentHistory,
                appointmentDate,
                appointmentDateEnd: appointmentDate.add(duration, 'minute'),
                duration,
              };
            }),
          };
        }),
        tap({
          next: (response) => {
            this.appointmentsHistory.next(response.payload);
          },
          error: (e) => {
            console.log(e);
            throw Error('not implemented yet : api error');
          },
        }),
        shareReplay(1)
      );
  }

  getAppointment(
    appointmentId: string
  ): Observable<ApiResponse<GetAppointment>> {
    if (!appointmentId) throw new Error('!appointmentId');
    return this.http
      .get<ApiResponse<GetAppointmentResponse>>(
        `/v1/appointments/${appointmentId}`
      )
      .pipe(
        map((response): ApiResponse<GetAppointment> => {
          const duration = response.payload.duration / 60;
          const appointmentDate = dayjs(duration);
          return {
            ...response,
            payload: {
              ...response.payload,
              duration,
              appointmentDate,
            },
          };
        }),
        tap({
          next: (response) => {
            this.appointment.next(response.payload);
          },
          error: (e) => {
            console.log(e);
            throw Error('not implemented yet : api error');
          },
        }),
        shareReplay(1)
      );
  }

  payAppointment(): Observable<ApiResponse<PutAppointment>> {
    const appointment = this.appointment.value;
    if (!appointment) {
      throw new Error("Impossibilité d'effectuer un paiement. !Paiement");
    } else if (appointment.status > 0) {
      throw new Error('Ce rendez-vous a déja été payé');
    }
    return this.http
      .put<ApiResponse<PutAppointmentResponse>>(
        `/v1/appointments/${appointment._id}/pay`,
        {}
      )
      .pipe(
        map((response): ApiResponse<PutAppointment> => {
          const duration = response.payload.duration / 60;
          const appointmentDate = dayjs(duration);
          return {
            ...response,
            payload: {
              ...response.payload,
              duration,
              appointmentDate,
            },
          };
        }),
        tap({
          next: (response) => {
            this.appointment.next(response.payload);
          },
          error: (e) => {
            console.log(e);
            throw Error('not implemented yet : api error');
          },
        }),
        shareReplay(1)
      );
  }

  validateAppointmentDone(
    appointment: AppointmentDetails
  ): Observable<ApiResponse<PutAppointment>> {
    if (!appointment) {
      throw new Error(
        "Impossibilité de mettre à jour le status à 'fait'. !AppointmentDetails"
      );
    } else if (appointment.status === 3) {
      throw new Error(
        'Ce rendez-vous a déja été effectué. Vous ne pouvez plus valider ce rendez-vous'
      );
    } else if (!this.appointmentList.value || !this.appointmentList.value.some((el)=>el._id === appointment._id)) {
      throw new Error(
        "Can't update an appointment that is not in the appointments' list"
      );
    }
    return this.http
      .put<ApiResponse<PutAppointmentResponse>>(
        `/v1/appointments/${appointment._id}/done`,
        {}
      )
      .pipe(
        map((response): ApiResponse<PutAppointment> => {
          const duration = response.payload.duration / 60;
          const appointmentDate = dayjs(duration);
          return {
            ...response,
            payload: {
              ...response.payload,
              duration,
              appointmentDate,
            },
          };
        }),
        tap({
          next: (response) => {
            if (this.appointmentList.value) {
              this.appointmentList.next(
                this.appointmentList.value.map((appointmentDetail) => ({
                  ...appointmentDetail,
                  status:
                    appointmentDetail._id === response.payload._id
                      ? response.payload.status
                      : appointmentDetail.status,
                }))
              );
            }
          },
          error: (e) => {
            console.log(e);
            throw Error('not implemented yet : api error');
          },
        }),
        shareReplay(1)
      );
  }

  getAppointments(): Observable<ApiResponse<AppointmentDetails[]>> {
    // if(!this.referenceDate)throw new Error('no reference date provided');
    if (!this.selectedDate.value) throw new Error('no selected date provided');
    return this.http
      .get<ApiResponse<AppointmentDetailsResponse[]>>(
        `/v1/appointments?referenceDate=${this.selectedDate.value.start.format(
          'YYYY-MM-DD'
        )}`
      )
      .pipe(
        map((response): ApiResponse<AppointmentDetails[]> => {
          return {
            ...response,
            payload: response.payload.map((appointment) => {
              const appointmentDate = dayjs(appointment.appointmentDate);
              const duration = appointment.duration / 60;
              const name =
                appointment.client.firstname +
                ' ' +
                appointment.client.lastname;
              return {
                ...appointment,
                appointmentDate,
                appointmentDateEnd: appointmentDate.add(duration, 'minute'),
                duration,
                client: { ...appointment.client, name },
              };
            }),
          };
        }),
        tap({
          next: (response) => {
            this.appointmentList.next(response.payload);
          },
          error: (e) => {
            console.log(e);
            throw Error('not implemented yet : api error');
          },
        }),
        shareReplay(1)
      );
  }

  getAppointmentDailyTasks(): Observable<ApiResponse<DailyTasksDetails>> {
    // if(!this.referenceDate)throw new Error('no reference date provided');
    if (!this.dailyTaskDate.value) throw new Error('no selected date provided');
    return this.http
      .get<ApiResponse<DailyTasksDetailsResponse>>(
        `/v1/appointments/daily-tasks/${this.dailyTaskDate.value.format(
          'YYYY-MM-DD'
        )}`
      )
      .pipe(
        map((response): ApiResponse<DailyTasksDetails> => {
          return {
            ...response,
            payload: {
              ...response.payload,
              appointments: response.payload.appointments.map((appointment) => {
                const appointmentDate = dayjs(appointment.appointmentDate);
                const duration = appointment.duration / 60;
                const name =
                  appointment.client.firstname +
                  ' ' +
                  appointment.client.lastname;
                return {
                  ...appointment,
                  appointmentDate,
                  appointmentDateEnd: appointmentDate.add(duration, 'minute'),
                  duration,
                  client: name,
                };
              }),
            },
          };
        }),
        tap({
          next: (response) => {
            this.dailyTaskDetails.next(response.payload);
          },
          error: (e) => {
            console.log(e);
            throw Error('not implemented yet : api error');
          },
        }),
        shareReplay(1)
      );
  }
}
