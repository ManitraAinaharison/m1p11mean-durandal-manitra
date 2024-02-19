import { Component } from '@angular/core';
import { ServiceModel } from '../../../../core/models/salon-service.model';
import { SalonService } from '../../../../core/services/salon-service.service';

@Component({
  selector: 'app-list-services',
  templateUrl: './list-services.component.html',
  styleUrl: './list-services.component.css',
})
export class ListServicesComponent {
  salonServiceList: ServiceModel[] = [];

  constructor(private salonService: SalonService) {}

  ngOnInit(): void {
    this.salonService.getServices().subscribe((servicesList) => {
      this.salonServiceList = servicesList;
    });
  }
}
