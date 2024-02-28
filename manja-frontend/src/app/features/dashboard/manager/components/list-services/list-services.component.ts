import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EditServiceComponent } from '../../modals/edit-service/edit-service.component';
import { SalonService } from '../../../../../core/services/salon-service.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ServiceModel } from '../../../../../core/models/salon-service.model';
import { environment } from '../../../../../../environments/environment';
import { ConfirmBoxService } from '../../../../../shared/services/confirm-box.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-list-services',
  templateUrl: './list-services.component.html',
  styleUrl: './list-services.component.css'
})
export class ListServicesComponent implements OnInit {

  baseImg = environment.baseUrl + '/images/';
  salonServiceList: ServiceModel[] = [];
  private subscription: Subscription = new Subscription();
  destroyRef = inject(DestroyRef);

  constructor(
    private dialog: MatDialog,
    private confirmBoxService: ConfirmBoxService,
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

  deleteService(service: ServiceModel): void {
    const title = `Suppression du service «${service.name}»`;
    const msg = "Voulez-vous supprimer ce service ?";
    const dialog = this.confirmBoxService.open(title, msg);

    this.subscription = this.confirmBoxService.confirm$
    .subscribe((data) => {
      if(data) {
        this.salonService
        .deleteService(service.slug)
        .subscribe(() => {
          this.subscription.unsubscribe();
          this.getListOfServices();
          dialog.close();
        });
      }
    });
  }
}
