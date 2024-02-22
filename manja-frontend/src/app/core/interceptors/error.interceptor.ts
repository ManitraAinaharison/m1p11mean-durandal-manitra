import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ErrorInterceptor implements HttpInterceptor {

    constructor(
      private router: Router
    ) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next
          .handle(req)
          .pipe(
            catchError((error: HttpErrorResponse) => {
              switch (error.status) {
                case 401:
                  this.redirectToLogin();
                  break;
                case 403:
                  this.redirectToLogin();
                  break;
                default:
                  break;
              }
              return throwError(() => error.error);
            })
          );
    }

    private redirectToLogin(): void {
      const currUrl = window.location.href;
      if (currUrl.includes('dashboard')) this.router.navigate(['/dashboard/login']);
      else this.router.navigate(['/login']);
    }

}
