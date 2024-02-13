import { CookieService } from 'ngx-cookie-service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class JwtService {

    constructor(
      private cookieService: CookieService
    ) {}

    getAccessToken(): string {
        return this.cookieService.get('accessToken');
    }
    getRefreshToken(): string {
        return this.cookieService.get('refreshToken');
    }

    destroyTokens(): void {
        this.cookieService.delete('accessToken');
        this.cookieService.delete('refreshToken');
    }
}
