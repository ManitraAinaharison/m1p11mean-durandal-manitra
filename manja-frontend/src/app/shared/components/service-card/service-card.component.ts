import { Component, Input } from '@angular/core';
import { SalonService } from '../../../core/services/salon-service.service';
import { ServiceModel } from '../../../core/models/salon-service.model';

@Component({
  selector: 'service-card',
  templateUrl: './service-card.component.html',
  styleUrl: './service-card.component.css',
})
export class ServiceCardComponent {
  @Input() salonServiceElement: ServiceModel | null = null;

  constructor(private salonService: SalonService) {}
}
