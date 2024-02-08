import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, distinctUntilChanged, map, shareReplay, tap } from 'rxjs';
import { Credentials, SignUpData, User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { JwtService } from './jwt.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {

    private currentUserSubject = new BehaviorSubject<User | null>(null);
    
    public currentUser = this.currentUserSubject.asObservable().pipe(distinctUntilChanged());
    public isAuthenticated = this.currentUser.pipe(map((user) => !!user));

    constructor(
        private readonly http: HttpClient,
        private readonly jwtService: JwtService,
        private readonly router: Router
    ) {}


    login(credentials: Credentials): Observable<User> {
        return this.http
          .post<User>("/users/customer-login", credentials)
          .pipe(tap((user) => this.setAuth(user)));
    }

    signup(userData: SignUpData): Observable<User> {
        return this.http
          .post<User>("/users/sign-up", userData)
          .pipe(tap((user) => this.setAuth(user)));
    }

    logout(): void {
        this.purgeAuth();
        void this.router.navigate(["/"]);
    }

    getCurrentUser(): Observable<User> {
        return this.http
            .get<User>("/user")
            .pipe(
                tap({
                    next: (user) => this.setAuth(user),
                    error: () => this.purgeAuth(),
                }),
                shareReplay(1)
            );
    }

    setAuth(user: User): void {
        this.jwtService.saveToken(user.token);
        this.currentUserSubject.next(user);
    }
    
    purgeAuth(): void {
        this.jwtService.destroyToken();
        this.currentUserSubject.next(null);
    }
}
