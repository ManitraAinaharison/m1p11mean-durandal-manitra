import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeService } from '../../../../../core/services/employee.service';
import { SalonService } from '../../../../../core/services/salon-service.service';
import { UserService } from '../../../../../core/services/user.service';
import { ConfirmBoxService } from '../../../../../shared/services/confirm-box.service';
import { EditEbitComponent } from '../../modals/edit-ebit/edit-ebit.component';
import { Ebit } from '../../../../../core/models/ebit.model';
import { EbitService } from '../../../../../core/services/ebit.service';
import { ApiSuccess } from '../../../../../core/models/api.model';

@Component({
  selector: 'app-list-ebit',
  templateUrl: './list-ebit.component.html',
  styleUrl: './list-ebit.component.css'
})
export class ListEbitComponent implements OnInit {

  listMonths: string[] = ['Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Aout','Septembre', 'Octobre', 'Novembre', 'Decembre'];

  constructor(
    private dialog: MatDialog,
    public ebitService: EbitService
  ) {}

  ngOnInit(): void {
    this.ebitService.getListEbit().subscribe(data => {
      this.ebitService.setListEbit(data.payload);
    })
  }

  openModal() {
    const dialogRef = this.dialog.open(EditEbitComponent, {
      width: '50%',
      panelClass: 'modal-container',
      backdropClass: 'modal-backdrop',
      data: {
        listMonths: this.listMonths
      }
    });

    dialogRef
    .afterClosed()
    .subscribe(() => {
        this.getListOfEbit();
    });
  }

  getListOfEbit() {
    this.ebitService
    .getListEbit()
    .subscribe((res: ApiSuccess) => {
      this.ebitService.setListEbit(res.payload);
    });
  }
}
