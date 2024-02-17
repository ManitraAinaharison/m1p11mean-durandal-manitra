import { Injectable } from '@angular/core';
import { BehaviorSubject, of, shareReplay, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Appointment, DateInterval } from '../models/appointment.model';
import { SubService } from '../models/salon-service.model';
import { Dayjs } from 'dayjs';
import { mockupFindNonAvailableHours } from './api-mock-data/appointment.mockdata';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private appointment = new BehaviorSubject<Appointment[] | null>(null);
  private selectedSubService = new BehaviorSubject<SubService | null>(null);
  private nonAvailableHours = new BehaviorSubject<DateInterval[]>([]);

  constructor(private readonly http: HttpClient) {}

  setSelectedSubService(selected: SubService | null) {
    this.selectedSubService.next(selected);
  }

  getNonAvailableHours(date: Dayjs) {
    // return this.http.get<Appointment[]>('/appointments/non-available/${date}').pipe(
    return of(mockupFindNonAvailableHours(date)).pipe(
      tap({
        next: (hours) => this.setNonAvailableHours(hours),
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
}
