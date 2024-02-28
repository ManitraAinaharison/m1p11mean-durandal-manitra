import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { UserService } from '../services/user.service';
import { map } from 'rxjs';
import { PageLoaderService } from '../../shared/services/page-loader.service';

export const authGuard: CanActivateFn = (route, state) => {
  const userService = inject<UserService>(UserService);
  const pageLoaderService = inject<PageLoaderService>(PageLoaderService);
  return userService
    .getCurrentUser()
    .pipe(
      map(() => {
          userService.errorMessage = "";
          userService.targetUrl = route.url[0].path;
          pageLoaderService.hide();
          return true;
      })
    );
};
