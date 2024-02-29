import { UserService } from './../../../../../core/services/user.service';
import { Component, OnInit } from '@angular/core';
import { EmployeeInformationsUpdateComponent } from '../../modals/employee-informations-update/employee-informations-update.component';
import { MatDialog } from '@angular/material/dialog';
import { environment } from '../../../../../../environments/environment';
import { EmployeeService } from '../../../../../core/services/employee.service';

@Component({
    selector: 'app-employee-informations',
    templateUrl: './employee-informations.component.html',
    styleUrl: './employee-informations.component.css'
})
export class EmployeeInformationsComponent implements OnInit {

    profileImg: string = "";
    empSubServices: string[] = [];

    constructor(
        private dialog: MatDialog,
        public userService: UserService,
        private employeeService : EmployeeService
    ) {}
    ngOnInit(): void {
        this.userService.currentUser.subscribe((user) => {
            this.profileImg = environment.baseUrl + '/images/' + user!.imgPath;
            this.empSubServices = user!.subServices!.map((subService) => subService.name);
            this.employeeService.getEmployeeSubServiceNames(user).subscribe((response)=>{
                this.empSubServices = response.payload
            })
        })
    }

    openModal() {
        const dialogRef = this.dialog.open(EmployeeInformationsUpdateComponent, {
            width: '50%',
            panelClass: 'modal-container',
            backdropClass: 'modal-backdrop',
        });

        dialogRef
        .afterClosed()
        .subscribe(() => {
            this.userService.getCurrentUser().subscribe();
        });
    }
}
