import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  shareReplay,
  tap,
  of,
  Observer,
} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { findEmployee } from './api-mock-data/employee.mockdata';
import { Employee } from '../models/user.model';
import { ApiResponse, ApiSuccess } from '../models/api.model';
import { Dayjs } from 'dayjs';
import { EmployeeSchedule } from '../models/appointment.model';

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
      .get<ApiResponse<EmployeeSchedule>>(
        `/v1/employees/${employeeId}/schedules?date=${selectedDate.format(
          'YYYY-MM-DD'
        )}`
      )
      .pipe(
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

  getListEmployees(): Observable<ApiSuccess> {
    return this.http
      .get<ApiSuccess>(`/v1/employees`)
      .pipe(shareReplay(1));
  }

  getEmployeesById(employeeId: string): Observable<ApiSuccess> {
    return this.http
      .get<ApiSuccess>(`/v1/employees/${employeeId}`)
      .pipe(shareReplay(1));
  }

  addNewEmployee(payload: FormData): Observable<ApiSuccess> {
    return this.http
    .post<ApiSuccess>('/v1/employees', payload)
    .pipe(shareReplay(1));
  }

  updateEmployee(employeeId: string, payload: FormData): Observable<ApiSuccess> {
    return this.http
    .put<ApiSuccess>(`/v1/Employees/${employeeId}`, payload)
    .pipe(shareReplay(1));
  }

  updateEmployeeActivation(employeeId: string, active: boolean): Observable<ApiSuccess> {
    return this.http
    .put<ApiSuccess>(`/v1/Employees/${employeeId}/activation`, { active: active })
    .pipe(shareReplay(1));
  }
}
