import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { EbitService } from '../../../../../core/services/ebit.service';
import { OverlayContainer } from '@angular/cdk/overlay';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fieldHasError } from '../../../../../shared/utils/form.util';
import { Ebit } from '../../../../../core/models/ebit.model';
import { ApiError } from '../../../../../core/models/api.model';

@Component({
  selector: 'app-edit-ebit',
  templateUrl: './edit-ebit.component.html',
  styleUrl: './edit-ebit.component.css'
})
export class EditEbitComponent implements OnInit, OnDestroy {

  years: number[];
  modalLoaded: boolean = false;
  ebitForm!: FormGroup;
  ebitFormError: string = "";
  ebitFormSubmitIsLoading: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<EditEbitComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {listMonths: string[]},
    private fb: FormBuilder,
    private ebitService: EbitService,
    private overlayContainer: OverlayContainer
  ) {
    this.overlayContainer.getContainerElement().classList.add('custom-overlay-container');
    this.initEbitForm();
    const currentYear = new Date().getFullYear();
    this.years = Array.from({ length: currentYear - 2019 }, (_, index) => 2020 + index);
    this.years.sort((a, b) => b - a);
  }

  ngOnInit(): void {
    this.modalLoaded = true;
  }


  initEbitForm() {
    this.ebitForm = this.fb.group({
      designation: new FormControl("", {
        validators: [Validators.required],
        nonNullable: true
      }),
      month: new FormControl("", {
        validators: [Validators.required],
        nonNullable: true
      }),
      year: new FormControl("", {
        validators: [Validators.required],
        nonNullable: true
      }),
      expenses: this.fb.array<FormGroup>([])
    });
  }

  get expenses(): FormArray {
    return this.ebitForm.get('expenses') as FormArray;
  }

  expenceFormGroupAt(index: number): FormGroup {
    return this.expenses.at(index) as FormGroup;
  }

  addExpense() {
    const expense = this.fb.group({
      designation: new FormControl("", {
        validators: [Validators.required],
        nonNullable: true
      }),
      amount: new FormControl("", {
        validators: [Validators.required],
        nonNullable: true
      })
    });

    this.expenses.push(expense);
  }

  deleteExpense(index: number): void{
    this.expenses.removeAt(index);
  }

  defineEbitPayload(): Ebit {
    const res: Ebit = {
      designation: this.ebitForm.value.designation,
      month: this.ebitForm.value.month,
      year: this.ebitForm.value.year,
      expenses: this.expenses.value
    };
    return res;
  }

  submitEbitForm() {
    this.ebitFormError = "";
    if (this.ebitForm.valid) {
      this.ebitFormSubmitIsLoading = true;
      const ebitPayload = this.defineEbitPayload();
      this.ebitService
      .addNewEbit(ebitPayload)
      .subscribe({
        next: () => {
          this.ebitFormSubmitIsLoading = false;
          this.close();
        },
        error: (err: ApiError) => {
          this.ebitFormSubmitIsLoading = false;
          this.ebitFormError = err.message;
        }
      });
    } else {
      this.ebitForm.markAllAsTouched();
    }
  }

  fieldHasErrorWrapper(form: FormGroup, formControlName: string, validatorName: string): boolean {
    return fieldHasError(form, formControlName, validatorName);
  }
  close() {
    this.ebitFormError = "";
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.overlayContainer.getContainerElement().classList.remove('custom-overlay-container');
  }
}
