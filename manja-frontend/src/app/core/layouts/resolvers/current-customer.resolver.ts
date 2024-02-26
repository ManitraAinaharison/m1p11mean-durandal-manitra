import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ApiSuccess } from '../../models/api.model';
import { UserService } from '../../services/user.service';
import { JwtService } from '../../services/jwt.service';
import { map } from 'rxjs';

export const currentCustomerResolver: ResolveFn<boolean> = (route, state) => {
  const userService = inject<UserService>(UserService);
  const jwtService = inject<JwtService>(JwtService);
  if (jwtService.getAccessToken() && jwtService.getRefreshToken()) {
    return userService
    .getCurrentUser()
    .pipe(
      map((res: ApiSuccess) => {
        if (res.payload.role == "CUSTOMER") {
          userService.setAuth(res.payload);
          return true;
        } else {
          userService.purgeAuth();
          return false;
        }
      })
    );
  } else {
    jwtService.destroyTokens();
    return false;
  };
};
