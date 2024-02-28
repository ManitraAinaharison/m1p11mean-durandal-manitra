import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { Observable, catchError, throwError } from 'rxjs';
import { UserService } from '../services/user.service';

@Injectable({
    providedIn: 'root'
})
export class ErrorInterceptor implements HttpInterceptor {

    constructor(
      private router: Router,
      private userService: UserService,
    ) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next
          .handle(req)
          .pipe(
            catchError((error: HttpErrorResponse) => {
              switch (error.status) {
                case 401:
                  this.redirectToLogin(error.error.message);
                  break;
                case 403:
                  this.redirectToLogin(error.error.message);
                  break;
                default:
                  break;
              }
              return throwError(() => error.error);
            })
          );
    }

    private redirectToLogin(errorMsg: string): void {
      this.userService.errorMessage = errorMsg;
      const currUrl = window.location.href;
      if (currUrl.includes('dashboard')) this.router.navigate(['/dashboard/login']);
      else this.router.navigate(['/login']);
    }

}
