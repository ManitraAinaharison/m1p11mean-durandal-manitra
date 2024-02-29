import { Component } from '@angular/core';
import { SalonService } from '../../../../../core/services/salon-service.service';
import { ServiceModel } from '../../../../../core/models/salon-service.model';
import { PageLoaderService } from '../../../../../shared/services/page-loader.service';

@Component({
  selector: 'app-list-services',
  templateUrl: './list-services.component.html',
  styleUrl: './list-services.component.css',
})
export class ListServicesComponent {
  salonServiceList: ServiceModel[] = [];
  loading: boolean = true;

  constructor(
    private salonService: SalonService,
    private pageLoaderService: PageLoaderService
  ) {}

  ngOnInit(): void {
    this.pageLoaderService.show();
    this.salonService.getServices().subscribe((response) => {
      this.salonServiceList = response.payload;
      this.loading = false;
      this.pageLoaderService.hide();
    });
  }
}
