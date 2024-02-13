import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SalonService } from '../../../../core/services/salon-service.service';
import { ServiceModel, SubService } from '../../../../core/models/salon-service.model';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.css',
})
export class ReservationComponent {
  serviceSlug: string | null = null;
  matchingService: ServiceModel | null = null;
  constructor(
    private route: ActivatedRoute,
    private salonService: SalonService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      let slug: string | null = params.get('sub-service-slug');
      this.serviceSlug = slug
      this.setMatchingService(slug);
    });
  }

  setMatchingService(slug: string | null) {
    if (!slug) return ;
    this.salonService
      .getService(slug)
      .subscribe((service) => (this.matchingService = service)); // handle if getSubService returns null
  }
}
