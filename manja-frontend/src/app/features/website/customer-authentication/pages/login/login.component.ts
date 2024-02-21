import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { ApiError } from '../../../../../core/models/api.model';
import { Credentials } from '../../../../../core/models/user.model';
import { UserService } from '../../../../../core/services/user.service';
import { markFormGroupTouched, fieldHasError } from '../../../../../shared/utils/form.util';


interface LoginForm {
    email: FormControl<string>;
    password: FormControl<string>;
}


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {

    loginForm!: FormGroup<LoginForm>;
    loginFormSubmitIsLoading: boolean = false;

    destroyRef = inject(DestroyRef);

    constructor(
        private fb: FormBuilder,
        private router: Router,
        public userService: UserService,
    ) {}

    ngOnInit(): void {
        this.initLoginForm();
    }

    initLoginForm(): void {
        this.loginForm = this.fb.group<LoginForm>({
            email: new FormControl("", {
                validators: [Validators.required],
                nonNullable: true
            }),
            password: new FormControl("", {
                validators: [Validators.required],
                nonNullable: true
            })
        });
    }

    defineLoginPayload(): Credentials {
        return {
            email: this.loginForm.value.email ?? '',
            password: this.loginForm.value.password ?? '',
        };
    }

    submitLoginForm(): void {
        this.userService.errorMessage = "";
        this.loginFormSubmitIsLoading = true;
        markFormGroupTouched(this.loginForm);

        if(this.loginForm.valid) {

            const loginPayload: Credentials = this.defineLoginPayload();

            this.userService
            .login(loginPayload)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => {
                    this.loginFormSubmitIsLoading = false;
                    const nextPage = this.userService.targetUrl === "" ? "/" : this.userService.targetUrl
                    this.router.navigate([nextPage])
                },
                error: (err: ApiError) => {
                    this.userService.errorMessage = err.message;
                    this.loginFormSubmitIsLoading = false;
                }
            });
        } else {
            this.loginFormSubmitIsLoading = false;
        }

    }

    fieldHasErrorWrapper(form: FormGroup, formControlName: string, validatorName: string): boolean {
        return fieldHasError(form, formControlName, validatorName);
    }
}

