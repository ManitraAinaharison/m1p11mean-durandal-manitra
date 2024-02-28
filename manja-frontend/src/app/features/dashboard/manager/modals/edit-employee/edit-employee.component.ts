import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, DestroyRef, ElementRef, Inject, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UserService } from '../../../../../core/services/user.service';
import { fieldHasError } from '../../../../../shared/utils/form.util';
import { TreeChild, TreeParent } from '../../../../../core/models/tree.model';
import { EmployeeService } from '../../../../../core/services/employee.service';
import { ApiError, ApiSuccess } from '../../../../../core/models/api.model';
import { imageSizeValidator } from '../../../../../shared/custom-validators';
import { SalonService } from '../../../../../core/services/salon-service.service';


@Component({
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.component.html',
  styleUrl: './edit-employee.component.css'
})
export class EditEmployeeComponent implements OnInit, OnDestroy {

  employeeForm!: FormGroup;
  modalLoaded: boolean = false;
  employeeFormSubmitIsLoading: boolean = false;
  employeeFormError: string = "";

  subServiceIds: string[] = [];
  checkedData: string[] = [];

  theImageHasChanged: boolean = false;

  destroyRef = inject(DestroyRef);

  constructor(
    private dialogRef: MatDialogRef<EditEmployeeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string, id?: string, serviceList: TreeParent[]},
    private fb: FormBuilder,
    public userService: UserService,
    public employeeService: EmployeeService,
    public salonService: SalonService,
    private overlayContainer: OverlayContainer
  ) {
    this.overlayContainer.getContainerElement().classList.add('custom-overlay-container');
    this.initEmployeeForm();
  }

  ngOnInit(): void {
    if (this.data.id) this.getDetailsEmployee();
    else this.modalLoaded = true;
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
    this.employeeService
    .getEmployeesById(this.data.id!)
    .subscribe({
      next: (res: ApiSuccess) => {
        if (res.success) {
          this.employeeForm.patchValue({
            img: null,
            firstname: res.payload.firstname,
            lastname: res.payload.lastname,
            username: res.payload.username,
            email: res.payload.email,
          });

          this.checkedData = this.buildCheckedData(res.payload.subServices);
          this.subServiceIds = res.payload.subServices

          if (res.payload.imgPath) {
            this.salonService
            .getImageFile(res.payload.imgPath)
            .subscribe({
              next: (file: File) => {
                this.employeeForm.patchValue({
                  img: file
                });
              }
            });
          }

          this.modalLoaded = true;
        }
      },
      complete: () => {
        this.employeeForm.markAllAsTouched();
      }
    })
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
    let img = this.employeeForm.value.img;
    if (this.data.id && !this.theImageHasChanged) img = null
    formData.append('img', img);
    const employeeData = {
      firstname: this.employeeForm.get('firstname')!.value,
      lastname: this.employeeForm.get('lastname')!.value,
      username: this.employeeForm.get('username')!.value,
      email: this.employeeForm.get('email')!.value,
      subServices: this.subServiceIds
    }
    formData.append('employee', JSON.stringify(employeeData));
    return formData;
  }

  submitEmployeeForm() {
    this.employeeFormError = "";
    const employeePayload = this.defineEmployeePayload();
    if (this.employeeForm.valid) {
      this.employeeFormSubmitIsLoading = true;
      if (this.data.id) {
        this.employeeService
        .updateEmployee(this.data.id, employeePayload)
        .subscribe({
          next: () => {
            this.employeeFormSubmitIsLoading = false;
            this.close();
          },
          error: (err: ApiError) => {
            this.employeeFormSubmitIsLoading = false;
            this.employeeFormError = err.message
          }
        })
      } else {
        this.employeeService
        .addNewEmployee(employeePayload)
        .subscribe({
          next: () => {
            this.employeeFormSubmitIsLoading = false;
            this.close();
          },
          error: (err: ApiError) => {
            this.employeeFormSubmitIsLoading = false;
            this.employeeFormError = err.message
          }
        })
      }

    } else {
      this.employeeForm.markAllAsTouched();
    }
  }

  private buildCheckedData(subServiceIds: string[]): string[] {
    let res: string[] = [];
    this.data.serviceList.forEach((service: TreeParent, serviceIndex: number) => {
      if (service.items) {
        service.items.forEach((subService: TreeChild, subServiceIndex: number) => {
          if (subServiceIds.includes(subService.value)) {
            res.push(serviceIndex + '_' + subServiceIndex);
          }
        });
      }
    })
    return [...new Set(res)];
  }

  fieldHasErrorWrapper(form: FormGroup, formControlName: string, validatorName: string): boolean {
    return fieldHasError(form, formControlName, validatorName);
  }

  close() {
    this.employeeFormError = "";
    this.checkedData = [];
    this.dialogRef.close();
  }

  onTreeOutputValueChange(event: any) {
    this.subServiceIds = event;
  }

  ngOnDestroy(): void {
    this.overlayContainer.getContainerElement().classList.remove('custom-overlay-container');
  }
}
