import { Component, DestroyRef, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../../../../../core/services/user.service';
import { ConfirmBoxService } from '../../../../../shared/services/confirm-box.service';
import { Subscription } from 'rxjs';
import { EditEmployeeComponent } from '../../modals/edit-employee/edit-employee.component';
import { Employee } from '../../../../../core/models/user.model';


@Component({
  selector: 'app-list-employees',
  templateUrl: './list-employees.component.html',
  styleUrl: './list-employees.component.css'
})
export class ListEmployeesComponent {

  employeeList: Employee[] = [];
  private subscription: Subscription = new Subscription();
  destroyRef = inject(DestroyRef);

  constructor(
    private dialog: MatDialog,
    private confirmBoxService: ConfirmBoxService,
    public userService: UserService
  ) {}

  openModal(employee: Employee | null = null): void {
    const dialogRef = this.dialog.open(EditEmployeeComponent, {
      width: '90%',
      panelClass: 'modal-container',
      backdropClass: 'modal-backdrop',
      data: {
        title: employee ? `Modification  des informations de ${employee.firstname} ${employee.lastname}` : "Ajout d'un nouvel employee",
        id: employee ? employee.id : null
      }
    });

    dialogRef
    .afterClosed()
    .subscribe(() => {
        this.getListOfEmployees();
    });
  }

  getListOfEmployees() {

  }
}
