import { Component } from '@angular/core';
import { SalonService } from '../../../../../core/services/salon-service.service';
import { ServiceModel } from '../../../../../core/models/salon-service.model';

@Component({
  selector: 'app-list-services',
  templateUrl: './list-services.component.html',
  styleUrl: './list-services.component.css',
})
export class ListServicesComponent {
  salonServiceList: ServiceModel[] = [];

  constructor(private salonService: SalonService) {}

  ngOnInit(): void {
    this.salonService.getServices().subscribe((response) => {
      this.salonServiceList = response.payload;
    });
  }
}
