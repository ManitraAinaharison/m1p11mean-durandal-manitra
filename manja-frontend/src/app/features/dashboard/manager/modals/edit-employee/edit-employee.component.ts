import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, DestroyRef, ElementRef, Inject, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UserService } from '../../../../../core/services/user.service';
import { fieldHasError } from '../../../../../shared/utils/form.util';


interface FoodNode {
  name: string;
  children?: FoodNode[];
}

const TREE_DATA: FoodNode[] = [
  {
    name: 'Fruit',
    children: [{name: 'Apple'}, {name: 'Banana'}, {name: 'Fruit loops'}],
  },
  {
    name: 'Vegetables',
    children: [
      {
        name: 'Green',
        children: [{name: 'Broccoli'}, {name: 'Brussels sprouts'}],
      },
      {
        name: 'Orange',
        children: [{name: 'Pumpkins'}, {name: 'Carrots'}],
      },
    ],
  },
];

/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}




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
  destroyRef = inject(DestroyRef);

  constructor(
    private dialogRef: MatDialogRef<EditEmployeeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string, id?: string},
    private fb: FormBuilder,
    private router: Router,
    public userService: UserService,
    private elementRef: ElementRef,
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
    this.employeeForm = this.fb.group({});
  }

  getDetailsEmployee() {

  }

  submitEmployeeForm() {

  }

  fieldHasErrorWrapper(form: FormGroup, formControlName: string, validatorName: string): boolean {
    return fieldHasError(form, formControlName, validatorName);
  }

  close() {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.overlayContainer.getContainerElement().classList.remove('custom-overlay-container');
  }
}
