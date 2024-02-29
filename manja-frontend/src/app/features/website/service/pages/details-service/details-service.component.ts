import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceModel } from '../../../../../core/models/salon-service.model';
import { SalonService } from '../../../../../core/services/salon-service.service';
import { PageLoaderService } from '../../../../../shared/services/page-loader.service';

@Component({
  selector: 'app-details-service',
  templateUrl: './details-service.component.html',
  styleUrl: './details-service.component.css',
})
export class DetailsServiceComponent {
  serviceSlug: string | null = null;
  matchingService: ServiceModel | null = null;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private salonService: SalonService,
    private pageLoaderService: PageLoaderService
  ) {}

  ngOnInit(): void {
    this.pageLoaderService.show();
    this.route.paramMap.subscribe((params) => {
      let slug: string | null = params.get('sub-service-slug');
      this.serviceSlug = slug;
      this.pageLoaderService.hide();
      if (this.serviceSlug === null) this.router.navigateByUrl(`/fergtrzretrhzrthtr`);
      else this.setMatchingService(slug);
    });
  }

  setMatchingService(slug: string | null) {
    if (!slug) return;
    this.salonService
      .getService(slug)
      .subscribe((response) => (this.matchingService = response.payload)); // handle if getSubService returns null
  }

  // routing
  redirectToReservationPage() {
    this.router.navigate([`/services/${this.serviceSlug}/reservation`]);
  }
}
