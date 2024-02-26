import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EditServiceComponent } from '../../modals/edit-service/edit-service.component';
import { SalonService } from '../../../../../core/services/salon-service.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ServiceModel } from '../../../../../core/models/salon-service.model';
import { environment } from '../../../../../../environments/environment';


@Component({
  selector: 'app-list-services',
  templateUrl: './list-services.component.html',
  styleUrl: './list-services.component.css'
})
export class ListServicesComponent implements OnInit {

  baseImg = environment.baseUrl + '/images/';
  salonServiceList: ServiceModel[] = [];
  destroyRef = inject(DestroyRef);

  constructor(
    private dialog: MatDialog,
    public salonService: SalonService
  ) {}

  ngOnInit(): void {
    this.getListOfServices();
  }

  getListOfServices() {
    this.salonService
    .getServices()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe((response) => {
      this.salonServiceList = response.payload;
    });
  }

  openModal(service: ServiceModel | null = null): void {
    const dialogRef = this.dialog.open(EditServiceComponent, {
      width: '90%',
      panelClass: 'modal-container',
      backdropClass: 'modal-backdrop',
      data: {
        title: service ? `Modification du service «${service.name}»` : "Ajout d'un nouveau service",
        slug: service ? service.slug : null
      }
    });

    dialogRef
    .afterClosed()
    .subscribe(() => {
        this.getListOfServices();
    });
  }
}
