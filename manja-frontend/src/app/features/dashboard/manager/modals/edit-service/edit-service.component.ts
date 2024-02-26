import { Component, DestroyRef, ElementRef, Inject, inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../../../core/services/user.service';
import { OverlayContainer } from '@angular/cdk/overlay';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { markFormGroupTouched, fieldHasError } from '../../../../../shared/utils/form.util';
import { SalonService } from '../../../../../core/services/salon-service.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ServiceModel, SubServiceModel } from '../../../../../core/models/salon-service.model';
import { ApiError } from '../../../../../core/models/api.model';
import { environment } from '../../../../../../environments/environment';

interface SubServiceForm {
  name: FormControl<string>;
  price: FormControl<number|null>;
  duration: FormControl<number|null>;
  ptgCommission: FormControl<number|null>;
  description: FormControl<string>;
}

interface ServiceForm {
  name: FormControl<string>;
  description: FormControl<string>;
  img: FormControl<any>;
  subServices: FormArray;
}


@Component({
  selector: 'app-edit-service',
  templateUrl: './edit-service.component.html',
  styleUrl: './edit-service.component.css'
})
export class EditServiceComponent {

  modalLoaded: boolean = false;
  showEditSection: boolean = false;
  showErrorMsgOnEditSection: boolean = false;
  serviceForm!: FormGroup<ServiceForm>;
  serviceFormError: string = "";
  subServiceForm!: FormGroup<SubServiceForm>;
  serviceFormSubmitIsLoading: boolean = false;
  titleSubServiceForm: string = "";
  currentSubServiceIndexToEdit: number = -1;
  destroyRef = inject(DestroyRef);

  constructor(
    private dialogRef: MatDialogRef<EditServiceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public salonService: SalonService,
    private fb: FormBuilder,
    private router: Router,
    public userService: UserService,
    private elementRef: ElementRef,
    private overlayContainer: OverlayContainer
  ) {
    this.overlayContainer.getContainerElement().classList.add('custom-overlay-container');
    this.initServiceForm();
    this.initSubServiceForm();
  }

  ngOnInit(): void {
    if (this.data.slug) this.getDetailsService();
    else this.modalLoaded = true;
  }

  getDetailsService() {
    this.salonService
    .getService(this.data.slug)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: (response) => {

        this.serviceForm.patchValue({
          name: response.payload.name,
          description: response.payload.description,
          img: null
        });

        response.payload.subServices.forEach((subService: SubServiceModel) => {
          this.addSubServiceFromSubServiceModel(subService)
        });
        this.modalLoaded = true;

        if (response.payload.imgPath) {
          this.salonService
          .getImageFile(response.payload.imgPath)
          .subscribe({
            next: (file: File) => {
              this.serviceForm.patchValue({
                img: file
              });
            }
          });
        }
      },
      complete: () => {
        console.log(this.serviceForm);
        this.serviceForm.markAllAsTouched();
      }
    });
  }

  initServiceForm(): void {
      this.serviceForm = this.fb.group<ServiceForm>({
          name: new FormControl("", {
              validators: [Validators.required, Validators.maxLength(30)],
              nonNullable: true
          }),
          description: new FormControl("", {
              validators: [Validators.required, Validators.maxLength(150)],
              nonNullable: true
          }),
          img: new FormControl(null, {
            validators: [Validators.required],
            nonNullable: true
          }),
          subServices: this.fb.array<FormGroup<SubServiceForm>>([])
      });
  }

  initSubServiceForm(): void {
      this.subServiceForm = this.fb.group<SubServiceForm>({
          name: new FormControl("", {
              validators: [Validators.required, Validators.maxLength(30)],
              nonNullable: true
          }),
          price: new FormControl(null, {
              validators: [Validators.required, Validators.min(0)],
              nonNullable: true
          }),
          duration: new FormControl(null, {
              validators: [Validators.required, Validators.min(0)],
              nonNullable: true
          }),
          ptgCommission: new FormControl(null, {
              validators: [Validators.required, Validators.min(0)],
              nonNullable: true
          }),
          description: new FormControl("", {
              validators: [Validators.required, Validators.maxLength(150)],
              nonNullable: true
          }),
      });
  }

  get subServices(): FormArray {
    return this.serviceForm.get('subServices') as FormArray;
  }

  showEditSubServiceSection(subServiceIndex: number = -1): void {
    if(subServiceIndex < 0) this.titleSubServiceForm = "Ajout d'un nouveau sous service";
    else {
      const subServiceFormGroup = this.subServices.at(subServiceIndex) as FormGroup;
      this.titleSubServiceForm = `Modification du sous service  «${subServiceFormGroup.get('name')?.value}»`;
      this.fillSubServiceForm(subServiceIndex);
      this.subServiceForm.markAllAsTouched();
    };
    this.showEditSection = true;
  }

  closeEditSubService() {
    this.resetSubServiceForm();
    this.currentSubServiceIndexToEdit = -1;
    this.showErrorMsgOnEditSection = false;
    this.showEditSection = false;
  }

  addSubService() {
    const newSubService = this.fb.group({
      name: this.subServiceForm.get('name')?.value,
      price: this.subServiceForm.get('price')?.value,
      duration: this.subServiceForm.get('duration')?.value,
      ptgCommission: this.subServiceForm.get('ptgCommission')?.value,
      description:  this.subServiceForm.get('description')?.value
    });
    this.subServices.push(newSubService);
  }
  editSubService(subServiceIndex: number) {
    const subServiceFormGroup = this.subServices.at(subServiceIndex) as FormGroup;
    subServiceFormGroup.patchValue({
      name: this.subServiceForm.get('name')?.value,
      price: this.subServiceForm.get('price')?.value,
      duration: this.subServiceForm.get('duration')?.value,
      ptgCommission: this.subServiceForm.get('ptgCommission')?.value,
      description:  this.subServiceForm.get('description')?.value
    });
  }


  addSubServiceFromSubServiceModel(subServiceModel: SubServiceModel) {
    const newSubService = this.fb.group({
      name: subServiceModel.name,
      price: subServiceModel.price,
      duration: subServiceModel.duration,
      ptgCommission: subServiceModel.ptgCommission,
      description:  subServiceModel.description
    });
    this.subServices.push(newSubService);
  }

  fillSubServiceForm(subServiceIndex: number) {
    const subServiceFormGroup = this.subServices.at(subServiceIndex) as FormGroup;
    this.subServiceForm.patchValue({
      name: subServiceFormGroup.get('name')?.value,
      price: subServiceFormGroup.get('price')?.value,
      duration: subServiceFormGroup.get('duration')?.value,
      ptgCommission: subServiceFormGroup.get('ptgCommission')?.value,
      description:  subServiceFormGroup.get('description')?.value
    });
  }

  resetSubServiceForm() {
    this.subServiceForm.reset();
    Object.keys(this.subServiceForm.controls).forEach(key => {
      this.subServiceForm.get(key)?.setErrors(null);
    });
  }

  submitSubServiceForm() {
    if (this.subServiceForm.valid) {
      this.addSubService();
      this.closeEditSubService();
    } else {
      this.subServiceForm.markAllAsTouched();
    }
  }

  removeSubService(index: number) {
    this.subServices.removeAt(index);
  }

  onImagePicked(event: any) {
    const file = event.addedFiles[0];
    this.serviceForm.patchValue({ img: file});
  }

  onImageRemove(): void {
    this.serviceForm.patchValue({ img: null});
  }

  defineServicePayload(): FormData {
    let formData = new FormData();
    const serviceData = {
      name: this.serviceForm.value.name,
      description: this.serviceForm.value.description,
      subServices: this.subServices.value
    };
    formData.append('img', this.serviceForm.value.img);
    formData.append('service', JSON.stringify(serviceData));
    return formData;
  }

  submitServiceForm() {
    this.serviceFormError = "";
    if(this.serviceForm.valid && this.showEditSection) this.showErrorMsgOnEditSection = true;
    if (this.serviceForm.valid && !this.showEditSection) {
      this.serviceFormSubmitIsLoading = true;
      const servicePayload = this.defineServicePayload();
      this.salonService
      .addNewService(servicePayload)
      .subscribe({
        next: () => {
          this.serviceFormSubmitIsLoading = false;
          this.close();
        },
        error: (err: ApiError) => {
          this.serviceFormSubmitIsLoading = false;
          this.serviceFormError = err.message
        }
      });
    } else {
      this.serviceForm.markAllAsTouched();
    }
  }

  fieldHasErrorWrapper(form: FormGroup, formControlName: string, validatorName: string): boolean {
    return fieldHasError(form, formControlName, validatorName);
  }

  close() {
    this.serviceFormError = "";
    this.overlayContainer.getContainerElement().classList.remove('custom-overlay-container');
    this.dialogRef.close();
  }
}
