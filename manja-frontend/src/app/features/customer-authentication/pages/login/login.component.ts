import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { UserService } from '../../../../core/services/user.service';
import { Credentials } from '../../../../core/models/user.model';
import { Router } from '@angular/router';
import { fieldHasError, markFormGroupTouched } from '../../../../shared/utils/form.util';


interface LoginForm {
    username: FormControl<string>;
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
    showErrorLoginForm: boolean = false;

    destroyRef = inject(DestroyRef);

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private userService: UserService,
    ) {}

    ngOnInit(): void {
        this.initLoginForm();
    }

    initLoginForm(): void {
        this.loginForm = this.fb.group<LoginForm>({
            username: new FormControl("", {
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
            username: this.loginForm.value.username ?? '',
            password: this.loginForm.value.password ?? '',
        };
    }

    submitLoginForm(): void {
        this.showErrorLoginForm = false;
        this.loginFormSubmitIsLoading = true;
        markFormGroupTouched(this.loginForm);
        
        if(this.loginForm.valid) {

            const loginPayload: Credentials = this.defineLoginPayload();

            this.userService
            .login(loginPayload)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => {
                    this.router.navigate(["/"])
                },
                error: (err) => {
                    this.showErrorLoginForm = true;
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

