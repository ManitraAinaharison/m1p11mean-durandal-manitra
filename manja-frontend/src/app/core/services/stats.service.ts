import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, shareReplay } from 'rxjs';
import { ApiSuccess } from '../models/api.model';
import { Sales } from '../models/stats.model';

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  private salesTodaySubject = new BehaviorSubject<Sales | null>(null);
  private salesCurrMonthSubject = new BehaviorSubject<Sales | null>(null);

  public salesToday = this.salesTodaySubject.asObservable();
  public salesCurrMonth = this.salesCurrMonthSubject.asObservable();

  constructor(
    private readonly http: HttpClient,
  ) { }

  getCurrentSales(): Observable<ApiSuccess> {
    return this.http
      .get<ApiSuccess>(`/v1/stats/sales`)
      .pipe(shareReplay(1));
  }

  getBookingFromLastSix() {
    let params = new HttpParams().set('nbrMonth', 6);
    return this.http
   .get<ApiSuccess>(`/v1/stats/bookings`, { params })
   .pipe(shareReplay(1));
  }

  setSalesToday(salesToday: Sales) {
    this.salesTodaySubject.next(salesToday);
  }

  setSalesCurrMonth(salesCurrMonth: Sales) {
    this.salesCurrMonthSubject.next(salesCurrMonth);
  }
}
