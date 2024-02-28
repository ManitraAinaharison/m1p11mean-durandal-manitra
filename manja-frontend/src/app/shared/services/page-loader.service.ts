import { Injectable, Renderer2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PageLoaderService {

  private showLoader = new BehaviorSubject<boolean>(false);

  showLoader$ = this.showLoader.asObservable();

  constructor() { }

  show() {
    this.showLoader.next(true);
  }

  hide() {
    this.showLoader.next(false);
  }
}
