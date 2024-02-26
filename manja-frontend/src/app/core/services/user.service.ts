import { JwtService } from './jwt.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, distinctUntilChanged, map, shareReplay, tap } from 'rxjs';
import { Credentials, SignUpData, User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { Route, Router } from '@angular/router';
import { ApiError, ApiSuccess } from '../models/api.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

    private currentUserSubject = new BehaviorSubject<User | null>(null);

    public currentUser = this.currentUserSubject.asObservable().pipe(distinctUntilChanged());
    public isAuthenticated = this.currentUser.pipe(map((user) => !!user));
    public errorMessage: string = "";
    public targetUrl: string = "";

    constructor(
        private readonly http: HttpClient,
        private readonly router: Router,
        private readonly jwtService: JwtService
    ) {}


    login(credentials: Credentials): Observable<ApiSuccess> {
        return this.http
          .post<ApiSuccess>("/v1/login", credentials)
          .pipe(tap((res: ApiSuccess) => this.setAuth(res.payload)));
    }

    adminLogin(credentials: Credentials): Observable<ApiSuccess> {
        return this.http
          .post<ApiSuccess>("/v1/admin/login", credentials)
          .pipe(tap((res: ApiSuccess) => this.setAuth(res.payload)));
    }

    signup(userData: SignUpData): Observable<ApiSuccess> {
        return this.http
          .post<ApiSuccess>("/v1/register", userData)
          .pipe(tap((res: ApiSuccess) => this.setAuth(res.payload)));
    }

    logout(): void {
        this.purgeAuth();
        let currentUrl = this.router.url;
        if (currentUrl.startsWith('/')) currentUrl = currentUrl.substring(1);
        const currentRoute: Route | null = this.router.config.find(route => route.path === currentUrl) || null;
        if (currentRoute && currentRoute.canActivate && currentRoute.canActivate.length > 0) {
          this.router.navigate(["/login"]);
        } else {
          return;
        }
    }

    getCurrentUser(): Observable<ApiSuccess> {
        return this.http
            .get<ApiSuccess>("/v1/user")
            .pipe(
                tap({
                    next: (res: ApiSuccess) => this.setAuth(res.payload),
                    error: () => this.purgeAuth(),
                }),
                shareReplay(1)
            );
    }

    setAuth(user: User): void {
        this.currentUserSubject.next(user);
    }

    purgeAuth(): void {
        // this.jwtService.destroyTokens();
        this.currentUserSubject.next(null);
    }
}
