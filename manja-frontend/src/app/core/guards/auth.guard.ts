import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { map } from 'rxjs';
import { PageLoaderService } from '../../shared/services/page-loader.service';
import { ApiSuccess } from '../models/api.model';

export const authGuard: CanActivateFn = (route, state) => {
  const userService = inject<UserService>(UserService);
  const pageLoaderService = inject<PageLoaderService>(PageLoaderService);
  return userService
    .getCurrentUser()
    .pipe(
      map((res: ApiSuccess) => {
          userService.errorMessage = "";
          userService.targetUrl = route.url[0].path;
          pageLoaderService.hide();
          return true;
      })
    );
};

export const employeeGuard: CanActivateFn = (route, state) => {
  const userService = inject<UserService>(UserService);
  const router = inject<Router>(Router);
  return userService
    .getCurrentUser()
    .pipe(
      map((res: ApiSuccess) => {
          userService.errorMessage = "Accès refusé";
          userService.targetUrl = route.url[0].path;
          if(res.payload.role != 'EMPLOYEE') router.navigate(['/dashboard/login']);
          return true;
      })
    );
};

export const managerGuard: CanActivateFn = (route, state) => {
  const userService = inject<UserService>(UserService);
  const router = inject<Router>(Router);
  return userService
    .getCurrentUser()
    .pipe(
      map((res: ApiSuccess) => {
          userService.errorMessage = "Accès refusé";
          userService.targetUrl = route.url[0].path;
          if(res.payload.role != 'MANAGER') router.navigate(['/dashboard/login']);
          return true;
      })
    );
};
