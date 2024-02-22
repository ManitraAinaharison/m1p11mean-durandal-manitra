import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, shareReplay, tap } from 'rxjs';
import { SubServiceModel } from '../models/salon-service.model';
import { Employee } from '../models/user.model';
import { ApiResponse } from '../models/api.model';

@Injectable({
  providedIn: 'root',
})
export class SubServiceService {
  private selectedSubService = new BehaviorSubject<SubServiceModel | null>(
    null
  );
  private relatedEmployees = new BehaviorSubject<Employee[] | []>([]);

  selectedSubService$ = this.selectedSubService.asObservable();
  relatedEmployees$ = this.relatedEmployees.asObservable();

  constructor(private readonly http: HttpClient) {}

  setSelectedSubService(value: SubServiceModel): void {
    this.selectedSubService.next(value);
  }

  setRelatedEmployees(value: Employee[]): void {
    this.relatedEmployees.next(value);
  }

  getSelectedSubServiceValue(): SubServiceModel | null {
    return this.selectedSubService.value;
  }

  getRelatedEmployees(): Observable<ApiResponse<Employee[]>> {
    if (!this.getSelectedSubServiceValue())
      return of({ success: true, payload: [] });
    return this.http
      .get<ApiResponse<Employee[]>>(
        `/v1/sub-services/${this.getSelectedSubServiceValue()?.slug}/employees`
      )
      .pipe(
        tap({
          next: (response) => this.setRelatedEmployees(response.payload),
          error: (e) => {
            console.log(e);
            throw Error('not implemented yet');
          },
        }),
        shareReplay(1)
      );
  }
}
