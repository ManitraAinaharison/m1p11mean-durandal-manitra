import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiError } from '../../../../../core/models/api.model';
import { Credentials } from '../../../../../core/models/user.model';
import { UserService } from '../../../../../core/services/user.service';
import { markFormGroupTouched, fieldHasError } from '../../../../../shared/utils/form.util';
import { PageLoaderService } from '../../../../../shared/services/page-loader.service';


interface LoginForm {
  email: FormControl<string>;
  password: FormControl<string>;
}


@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css'
})
export class AdminLoginComponent {

  loginForm!: FormGroup<LoginForm>;
  loginFormSubmitIsLoading: boolean = false;

  destroyRef = inject(DestroyRef);

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public userService: UserService,
    public pageLoaderService: PageLoaderService,
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
          .adminLogin(loginPayload)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
              next: () => {
                  this.loginFormSubmitIsLoading = false;
                  const nextPage = this.userService.targetUrl === "" ? "/dashboard/" : "/dashboard/" + this.userService.targetUrl
                  this.router.navigate([nextPage]);
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
