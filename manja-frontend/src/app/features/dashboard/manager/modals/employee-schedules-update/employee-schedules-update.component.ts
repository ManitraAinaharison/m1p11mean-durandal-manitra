import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fieldHasError } from '../../../../../shared/utils/form.util';
import { timeValidator } from '../../../../../shared/custom-validators';
import { EmployeeService } from '../../../../../core/services/employee.service';
import { ApiError } from '../../../../../core/models/api.model';

@Component({
  selector: 'app-employee-schedules-update',
  templateUrl: './employee-schedules-update.component.html',
  styleUrl: './employee-schedules-update.component.css'
})
export class EmployeeSchedulesUpdateComponent implements OnInit{

  modalLoaded: boolean = false
  employeeSchedulesUpdateFormError: string = "";
  employeeSchedulesUpdateFormSubmitIsLoading: boolean = false;
  employeeSchedulesUpdateForm!: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<EmployeeSchedulesUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { day: number, dayName: string, start: string, end: string} ,
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private overlayContainer: OverlayContainer
  ) {
    this.overlayContainer.getContainerElement().classList.add('custom-overlay-container');
    this.initEmployeeSchedulesUpdateForm();
  }
  ngOnInit(): void {
    this.modalLoaded = true;
  }

  initEmployeeSchedulesUpdateForm() {
    this.employeeSchedulesUpdateForm = this.fb.group({
      start: [this.data.start.replace('--:--', '') , [Validators.required]],
      end: [this.data.end.replace('--:--', '') , [Validators.required, timeValidator('start', 'end')]]
    });
  }

  defineEmployeeSchedulesUpdatePayload() {
    return {
      day: this.data.day,
      start: this.employeeSchedulesUpdateForm.value.start,
      end: this.employeeSchedulesUpdateForm.value.end
    };
  }

  submitEmployeeSchedulesUpdateForm() {
    if(this.employeeSchedulesUpdateForm.valid) {
      this.employeeSchedulesUpdateFormSubmitIsLoading = true;
      const employeeSchedulesUpdatePayload = this.defineEmployeeSchedulesUpdatePayload();
      this.employeeService
        .updateEmployeeWorkSchedules(employeeSchedulesUpdatePayload)
        .subscribe({
            next: () => {
                this.employeeSchedulesUpdateFormSubmitIsLoading = false;
                this.close();
            },
            error: (err: ApiError) => {
                this.employeeSchedulesUpdateFormSubmitIsLoading = false;
                this.employeeSchedulesUpdateFormError = err.message
            }
        });
    } else {
      this.employeeSchedulesUpdateForm.markAllAsTouched();
    }
  }

  fieldHasErrorWrapper(form: FormGroup, formControlName: string, validatorName: string): boolean {
    return fieldHasError(form, formControlName, validatorName);
  }
  close() {
    this.employeeSchedulesUpdateFormError = "";
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.overlayContainer.getContainerElement().classList.remove('custom-overlay-container');
  }
}
