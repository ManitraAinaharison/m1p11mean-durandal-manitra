import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, distinctUntilChanged, map, shareReplay, tap } from 'rxjs';
import { Credentials, SignUpData, User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { JwtService } from './jwt.service';
import { Router } from '@angular/router';
import { ApiError, ApiSuccess } from '../models/api.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

    private currentUserSubject = new BehaviorSubject<User | null>(null);

    public currentUser = this.currentUserSubject.asObservable().pipe(distinctUntilChanged());
    public isAuthenticated = this.currentUser.pipe(map((user) => !!user));
    public errorMessage: string = "";

    constructor(
        private readonly http: HttpClient,
        private readonly jwtService: JwtService,
        private readonly router: Router
    ) {}


    login(credentials: Credentials): Observable<ApiSuccess> {
        return this.http
          .post<ApiSuccess>("/v1/login", credentials, { withCredentials: true })
          .pipe(tap((res) => this.setAuth(res.payload)));
    }

    signup(userData: SignUpData): Observable<ApiSuccess> {
        return this.http
          .post<ApiSuccess>("/v1/register", userData)
          .pipe(tap((res: ApiSuccess) => this.setAuth(res.payload)));
    }

    logout(): void {
        this.purgeAuth();
        void this.router.navigate(["/"]);
    }

    getCurrentUser(): Observable<ApiSuccess> {
        return this.http
            .get<ApiSuccess>("/v1/user", { withCredentials: true })
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
        this.currentUserSubject.next(null);
    }
}
