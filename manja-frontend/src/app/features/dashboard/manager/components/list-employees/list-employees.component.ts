import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../../../../../core/services/user.service';
import { ConfirmBoxService } from '../../../../../shared/services/confirm-box.service';
import { Subscription } from 'rxjs';
import { EditEmployeeComponent } from '../../modals/edit-employee/edit-employee.component';
import { Employee } from '../../../../../core/models/user.model';
import { SalonService } from '../../../../../core/services/salon-service.service';
import { ApiResponse, ApiSuccess } from '../../../../../core/models/api.model';
import { ServiceModel, SubServiceModel } from '../../../../../core/models/salon-service.model';
import { TreeChild, TreeParent } from '../../../../../core/models/tree.model';
import { EmployeeService } from '../../../../../core/services/employee.service';
import { environment } from '../../../../../../environments/environment';


@Component({
  selector: 'app-list-employees',
  templateUrl: './list-employees.component.html',
  styleUrl: './list-employees.component.css'
})
export class ListEmployeesComponent implements OnInit {

  baseImg = environment.baseUrl + '/images/';

  employeesList: Employee[] = [];
  listServicesTree: TreeParent[] = [];
  private subscription: Subscription = new Subscription();
  destroyRef = inject(DestroyRef);

  constructor(
    private dialog: MatDialog,
    private confirmBoxService: ConfirmBoxService,
    public userService: UserService,
    private employeeService: EmployeeService,
    private salonService: SalonService
  ) {}

  ngOnInit(): void {
    this.getListOfServices();
    this.getListOfEmployees();
  }

  openModal(employee: Employee | null = null): void {
    const dialogRef = this.dialog.open(EditEmployeeComponent, {
      width: '90%',
      panelClass: 'modal-container',
      backdropClass: 'modal-backdrop',
      data: {
        title: employee ? `Modification  des informations de ${employee.firstname} ${employee.lastname}` : "Ajout d'un nouvel employee",
        id: employee ? employee._id : null,
        serviceList: this.listServicesTree
      }
    });

    dialogRef
    .afterClosed()
    .subscribe(() => {
        this.getListOfEmployees();
    });
  }

  getListOfServices() {
    this.salonService
    .getServices()
    .subscribe((res: ApiResponse<ServiceModel[]>) => {
      this.formatListServiceToTree(res.payload);
    });
  }

  getListOfEmployees() {
    this.employeeService
    .getListEmployees()
    .subscribe((res: ApiSuccess) => {
      this.employeesList = res.payload;
    });
  }

  updateEmployeeActivation(employee: Employee) {
    const title = `Désactivation du compte de ${employee.firstname + ' ' + employee.lastname}`;
    const msg = "Voulez-vous désactiver le compte de cet employé ?";
    const dialog = this.confirmBoxService.open(title, msg);

    let employeeIndex: number = this.employeesList.findIndex(emp => emp._id === employee._id);
    const activeCurrVal = this.employeesList[employeeIndex].isActive ;
    this.employeesList[employeeIndex].isActive = !activeCurrVal;

    this.subscription = this.confirmBoxService.confirm$
    .subscribe((data) => {
      if(data) {
        this.employeeService
        .updateEmployeeActivation(employee._id!, !activeCurrVal)
        .subscribe(() => {
          this.subscription.unsubscribe();
          dialog.close(true);
        });
      }

      dialog.afterClosed()
      .subscribe((data) => {
        if(!data) {
          this.employeesList[employeeIndex].isActive = activeCurrVal;
          this.subscription.unsubscribe();
        }
      })
    });
  }

  private formatListServiceToTree(services: ServiceModel[]) {
    const res = services.map((service: ServiceModel): TreeParent => {
      return {
        text: service.name,
        items: service.subServices.map((subService: SubServiceModel): TreeChild => {
          return {
            text: subService.name,
            value: subService._id
          };
        })
      }
    });
    this.listServicesTree = res;
  }
}
