import { inject } from '@angular/core';
import { CanActivateFn, Router, Routes } from '@angular/router';
import { UserService } from '../services/user.service';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const userService = inject<UserService>(UserService);
  const router = inject<Router>(Router);
  return userService
    .isAuthenticated
    .pipe(
      map((isAuth) => {
        if (!isAuth) {
          userService.errorMessage = "";
          userService.targetUrl = route.url[0].path;
          router.navigate(['/login']);
        }
        return true;
      })
    );
};
