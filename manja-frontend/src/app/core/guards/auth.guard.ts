import { inject } from '@angular/core';
import { ActivatedRoute, CanActivateFn, Router, Routes } from '@angular/router';
import { UserService } from '../services/user.service';
import { catchError, distinctUntilChanged, map, throwError } from 'rxjs';
import { ApiSuccess } from '../models/api.model';
import { HttpErrorResponse } from '@angular/common/http';

export const authGuard: CanActivateFn = (route, state) => {
  const userService = inject<UserService>(UserService);
  const router = inject<Router>(Router);
  return userService
    .getCurrentUser()
    .pipe(
      map((res: ApiSuccess) => {
          const user = res.payload;
          userService.errorMessage = "";
          userService.targetUrl = route.url[0].path;
          return true;
      }),
      catchError((err: HttpErrorResponse) => {
        console.log('     ', err);
        userService.errorMessage = err.message;
        switch (err.status) {
          case 401:
            redirectToLogin(router);
            break;
          case 403:
            redirectToLogin(router);
            break;
          default:
            break;
        }
        return throwError(() => err.error);
      })
    );
};

function redirectToLogin(router: Router): void {
  const currUrl = window.location.href;
  if (currUrl.includes('dashboard')) router.navigate(['/dashboard/login']);
  else router.navigate(['/login']);
}
