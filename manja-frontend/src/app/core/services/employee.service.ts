import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  shareReplay,
  tap,
  of,
  Observer,
  map,
} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { findEmployee } from './api-mock-data/employee.mockdata';
import { Employee } from '../models/user.model';
import { ApiResponse } from '../models/api.model';
import { Dayjs } from 'dayjs';
import { EmployeeSchedule, PrimaryDateEmployeeSchedule } from '../models/appointment.model';
import { toEmployeeSchedule } from '../util/date.util';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private employeeList = new BehaviorSubject<Employee[] | null>(null);

  constructor(private readonly http: HttpClient) {}
  getEmployees(query?: {
    filters?: {
      name?: string;
      serviceSlug?: string;
    };
    orderBy?: {
      field: 'favourites';
      order: 'ASC' | 'DESC';
    };
  }): Observable<Employee[]> {
    // return this.http.get<Employee[]>('/employees').pipe(
    return of(findEmployee(query)).pipe(
      tap({
        next: (employees) => {
          this.setEmployees(employees);
        },
        error: () => {
          throw Error('not implemented yet');
        },
      }),
      shareReplay(1)
    );
  }

  setEmployees(value: Employee[]) {
    this.employeeList.next(value);
  }

  getEmployeeSchedule(
    employeeId: string | undefined,
    selectedDate: Dayjs
  ): Observable<ApiResponse<EmployeeSchedule | null>> {
    if (!employeeId || !selectedDate)
      return of({ success: true, payload: null });
    return this.http
      .get<ApiResponse<PrimaryDateEmployeeSchedule>>(
        `/v1/employees/${employeeId}/schedules?date=${selectedDate.format(
          'YYYY-MM-DD'
        )}`
      )
      .pipe(
        map((response)=>{
          return {
            ...response,
            payload: toEmployeeSchedule(response.payload, selectedDate),
          };
        }),
        tap({
          next: (response) => {},
          error: (e) => {
            console.log(e);
            throw Error('not implemented yet');
          },
        }),
        shareReplay(1)
      );
  }
}
