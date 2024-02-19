import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, shareReplay, tap, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { findEmployee } from './api-mock-data/employee.mockdata';
import { Employee } from '../models/user.model';

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
        next: (employees) => {this.setEmployees(employees);},
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
}
