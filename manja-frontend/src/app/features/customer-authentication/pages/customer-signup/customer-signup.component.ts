import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../../core/services/user.service';
import { SignUpData } from '../../../../core/models/user.model';
import { fieldHasError, markFormGroupTouched } from '../../../../shared/utils/form.util';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { equalValueValidator } from '../../../../shared/custom-validators';
import { ApiError } from '../../../../core/models/api.model';


interface SignUpForm {
    firstname: FormControl<string>;
    lastname: FormControl<string>;
    email: FormControl<string>;
    username: FormControl<string>;
    password: FormControl<string>;
    confirmPassword: FormControl<string>;
}


@Component({
    selector: 'app-customer-signup',
    templateUrl: './customer-signup.component.html',
    styleUrl: './customer-signup.component.css'
})
export class CustomerSignupComponent implements OnInit {

    signUpForm!: FormGroup<SignUpForm>;
    signUpFormSubmitIsLoading: boolean = false;
    errorSignUpForm: string = "";

    destroyRef = inject(DestroyRef);

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private userService: UserService,
    ) {}

    ngOnInit(): void {
        this.initSignUpForm();
    }

    initSignUpForm(): void {
        this.signUpForm = this.fb.group<SignUpForm>({
            firstname: new FormControl("", {
                validators: [Validators.required],
                nonNullable: true
            }),
            lastname: new FormControl("", {
                validators: [Validators.required],
                nonNullable: true
            }),
            email: new FormControl("", {
                validators: [Validators.required, Validators.email],
                nonNullable: true
            }),
            username: new FormControl("", {
                validators: [Validators.required],
                nonNullable: true
            }),
            password: new FormControl("", {
                validators: [Validators.required],
                nonNullable: true
            }),
            confirmPassword: new FormControl("", {
                validators: [Validators.required, equalValueValidator('password')],
                nonNullable: true
            })
        });
    }

    defineSignUpPayload(): SignUpData {
        return {
            firstname: this.signUpForm.value.firstname ?? '',
            lastname: this.signUpForm.value.lastname ?? '',
            email: this.signUpForm.value.email ?? '',
            username: this.signUpForm.value.username ?? '',
            password: this.signUpForm.value.password ?? ''
        };
    }

    submitSignUpForm(): void {
        this.errorSignUpForm = "";
        this.signUpFormSubmitIsLoading = true;
        markFormGroupTouched(this.signUpForm);

        if(this.signUpForm.valid) {

            const signupPayload: SignUpData = this.defineSignUpPayload();

            this.userService
            .signup(signupPayload)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => {
                  this.signUpFormSubmitIsLoading = false;
                  const nextPage = this.userService.targetUrl === "" ? "/" : this.userService.targetUrl
                  this.router.navigate([nextPage])
                },
                error: (err: ApiError) => {
                  this.errorSignUpForm = err.message;
                  this.signUpFormSubmitIsLoading = false;
                }
            });

        } else {
            this.signUpFormSubmitIsLoading = false;
        }
    }

    fieldHasErrorWrapper(form: FormGroup, formControlName: string, validatorName: string): boolean {
        return fieldHasError(form, formControlName, validatorName);
    }
}
