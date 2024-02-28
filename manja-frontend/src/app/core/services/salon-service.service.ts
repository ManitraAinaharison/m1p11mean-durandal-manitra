import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, shareReplay, tap, of, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ServiceModel } from '../models/salon-service.model';
import { ApiResponse, ApiSuccess } from '../models/api.model';

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
        map((response) => {
          return {
            ...response,
            payload: {
              ...response.payload,
              subServices: response.payload.subServices.map((sub) => ({
                ...sub,
                duration: sub.duration / 60,
              })),
            },
          };
        }),
        tap({
          next: (response) => this.setSelectedService(response.payload),
          error: () => {
            throw Error('not implemented yet');
          },
        }),
        shareReplay(1)
      );
  }

  addNewService(payload: FormData): Observable<ApiSuccess> {
    return this.http
    .post<ApiSuccess>('/v1/services', payload)
    .pipe(shareReplay(1));
  }

  updateService(slugService: string, payload: FormData): Observable<ApiSuccess> {
    return this.http
    .put<ApiSuccess>(`/v1/services/${slugService}`, payload)
    .pipe(shareReplay(1));
  }

  deleteService(slugService: string): Observable<ApiSuccess> {
    return this.http
    .delete<ApiSuccess>(`/v1/services/${slugService}`)
    .pipe(shareReplay(1));
  }

  getImageFile(imgName: string): Observable<File> {
    return this.http
      .get('/images/' + imgName, { responseType: 'blob' })
      .pipe(
        map((blob) => {
          return new File([blob], 'service-img', { type: blob.type });
        })
      );
  }
}
