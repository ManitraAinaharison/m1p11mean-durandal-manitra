import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, shareReplay, tap } from 'rxjs';
import { Ebit } from '../models/ebit.model';
import { ApiSuccess } from '../models/api.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EbitService {

  private ebitListSubject = new BehaviorSubject<Ebit[]>([]);

  public ebitList = this.ebitListSubject.asObservable();

  constructor(
    private readonly http: HttpClient,
  ) { }

  getListEbit(): Observable<ApiSuccess> {
    return this.http
      .get<ApiSuccess>(`/v1/ebit`)
      .pipe(shareReplay(1));
  }

  addNewEbit(ebit: Ebit): Observable<ApiSuccess> {
    return this.http
      .post<ApiSuccess>(`/v1/ebit`, ebit)
      .pipe(shareReplay(1));
  }

  setListEbit(ebit: Ebit[]): void {
    this.ebitListSubject.next(ebit);
  }

  setNewElement(ebit: Ebit): void {
    this.ebitListSubject.next([ebit,...this.ebitListSubject.value]);
  }
}
