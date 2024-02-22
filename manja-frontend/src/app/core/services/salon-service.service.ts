import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, shareReplay, tap, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ServiceModel } from '../models/salon-service.model';
import { ApiResponse } from '../models/api.model';

@Injectable({
  providedIn: 'root',
})
export class SalonService {
  private serviceList = new BehaviorSubject<ServiceModel[] | null>(null);
  private selectedService = new BehaviorSubject<ServiceModel | null>(null);

  constructor(private readonly http: HttpClient) {}
  getServices(): Observable<ApiResponse<ServiceModel[]>> {
    return this.http.get<ApiResponse<ServiceModel[]>>('/v1/services').pipe(
      tap({
        next: (response) => this.setServiceList(response.payload),
        error: (e) => {
          console.log(e);
          throw Error('not implemented yet');
        },
      }),
      shareReplay(1)
    );
  }

  setServiceList(newServiceList: ServiceModel[]): void {
    this.serviceList.next(newServiceList);
  }

  setSelectedService(selected: ServiceModel | null) {
    this.selectedService.next(selected);
  }

  getService(slug: string): Observable<ApiResponse<ServiceModel>> {
    return this.http
      .get<ApiResponse<ServiceModel>>(`/v1/services/${slug}`)
      .pipe(
        tap({
          next: (response) => this.setSelectedService(response.payload),
          error: () => {
            throw Error('not implemented yet');
          },
        }),
        shareReplay(1)
      );
  }
}
