import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, shareReplay, tap, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ServiceModel, SubService } from '../models/salon-service.model';
import { salonServiceMockData, subServiceMockData } from './service.mockdata';

@Injectable({
  providedIn: 'root',
})
export class SalonService {
  private serviceList = new BehaviorSubject<ServiceModel[] | null>(null);
  private selectedService = new BehaviorSubject<ServiceModel | null>(null);
  private selectedSubService = new BehaviorSubject<SubService | null>(null);

  constructor(private readonly http: HttpClient) {}
  getServices(): Observable<ServiceModel[]> {
    // return this.http.get<ServiceModel[]>('/services').pipe(
    return of(salonServiceMockData).pipe(
      tap({
        next: (service) => this.setServiceList(service),
        error: () => {
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

  setSelectedSubService(selected: SubService | null) {
    this.selectedSubService.next(selected);
  }

  getService(slug: string): Observable<ServiceModel> {
    // return this.http.get<SubService>('/sub-services/:slug').pipe(
    return of(
      salonServiceMockData.find((s) => s.slug === slug) as ServiceModel
    ).pipe(
      tap({
        next: (service) => this.setSelectedService(service),
        error: () => {
          throw Error('not implemented yet');
        },
      }),
      shareReplay(1)
    );
  }
}
