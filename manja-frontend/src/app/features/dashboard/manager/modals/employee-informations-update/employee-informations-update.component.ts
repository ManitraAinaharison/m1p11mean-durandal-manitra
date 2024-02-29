import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { EditEmployeeComponent } from '../edit-employee/edit-employee.component';
import { UserService } from '../../../../../core/services/user.service';
import { ApiError, ApiSuccess } from '../../../../../core/models/api.model';
import { SalonService } from '../../../../../core/services/salon-service.service';
import { Employee, User } from '../../../../../core/models/user.model';
import { equalValueValidator, imageSizeValidator } from '../../../../../shared/custom-validators';
import { fieldHasError } from '../../../../../shared/utils/form.util';
import { EmployeeService } from '../../../../../core/services/employee.service';

@Component({
    selector: 'app-employee-informations-update',
    templateUrl: './employee-informations-update.component.html',
    styleUrl: './employee-informations-update.component.css'
})
export class EmployeeInformationsUpdateComponent implements OnInit, OnDestroy {

    employeeId: string = "";
    modalLoaded: boolean = false;
    employeeForm!: FormGroup;
    employeeFormError: string = "";
    theImageHasChanged: boolean = false;
    employeeFormSubmitIsLoading: boolean = false;

    changePassword:boolean = false;

    constructor(
        private dialogRef: MatDialogRef<EditEmployeeComponent>,
        private fb: FormBuilder,
        private userService: UserService,
        private employeeService: EmployeeService,
        private salonService: SalonService,
        private overlayContainer: OverlayContainer
    ) {
        this.overlayContainer.getContainerElement().classList.add('custom-overlay-container');
        this.initEmployeeForm();
    }

    ngOnInit(): void {
        this.getDetailsEmployee()
    }

    initEmployeeForm() {
        this.employeeForm = this.fb.group({
            img: [null, [Validators.required, imageSizeValidator(5)]],
            firstname: ['', [Validators.required]],
            lastname: ['', [Validators.required]],
            username: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
        });
    }

    getDetailsEmployee() {
        this.userService
        .currentUser
        .subscribe({
            next: (employee) => {
                if (employee) {
                    const emp: Employee = employee = employee as Employee;
                    this.employeeId = emp._id as string;

                    this.employeeForm.patchValue({
                        img: null,
                        firstname: emp.firstname,
                        lastname: emp.lastname,
                        username: emp.username,
                        email: emp.email,
                    });

                    if (emp.imgPath) {
                        this.salonService
                        .getImageFile(emp.imgPath)
                        .subscribe({
                            next: (file: File) => {
                            this.employeeForm.patchValue({
                                img: file
                            });
                            }
                        });
                    }
                }

                this.modalLoaded = true;
            },
            complete: () => {
              this.employeeForm.markAllAsTouched();
            }
        })
    }

    onChangePassword() {

        this.changePassword = !this.changePassword;
        if(this.changePassword) {
            this.employeeForm.addControl('password',new FormControl("", {
                validators: [Validators.required],
                nonNullable: true
            }));
            this.employeeForm.addControl('confirmPassword',new FormControl("", {
                validators: [Validators.required, equalValueValidator('password')],
                nonNullable: true
            }));
        } else {
            this.employeeForm.removeControl('password');
            this.employeeForm.removeControl('confirmPassword');
        }
    }

    onImagePicked(event: any) {
        const file = event.addedFiles[0];
        this.theImageHasChanged = true;
        this.employeeForm.patchValue({ img: file});
    }

    onImageRemove(): void {
        this.employeeForm.patchValue({ img: null});
    }

    defineEmployeePayload(): FormData {
        let formData = new FormData();
        let image = this.employeeForm.value.img;
        if (!this.theImageHasChanged) image = null;
        formData.append('img', image);
        const { img, confirmPassword, ...employeeData} = this.employeeForm.value;
        console.log(employeeData);
        formData.append('employee', JSON.stringify(employeeData));
        return formData;
    }

    submitEmployeeForm() {
        this.employeeFormError = "";
        const employeePayload = this.defineEmployeePayload();
        if (this.employeeForm.valid) {
            this.employeeService
            .updateEmployeeItself(employeePayload)
            .subscribe({
                next: () => {
                    this.employeeFormSubmitIsLoading = false;
                    this.close();
                },
                error: (err: ApiError) => {
                    this.employeeFormSubmitIsLoading = false;
                    this.employeeFormError = err.message
                }
            });
        } else {
            this.employeeForm.markAllAsTouched();
        }
    }

    fieldHasErrorWrapper(form: FormGroup, formControlName: string, validatorName: string): boolean {
        return fieldHasError(form, formControlName, validatorName);
    }

    close() {
        this.employeeFormError = "";
        this.dialogRef.close();
    }

    ngOnDestroy(): void {
        this.overlayContainer.getContainerElement().classList.remove('custom-overlay-container');
    }
}
