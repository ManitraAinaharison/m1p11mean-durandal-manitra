import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomepageComponent } from './pages/homepage/homepage.component';
import { BeautySalonPresentationComponent } from './components/beauty-salon-presentation/beauty-salon-presentation.component';
import { SalonLocationComponent } from './components/salon-location/salon-location.component';
import { WhyComeToSalonComponent } from './components/why-come-to-salon/why-come-to-salon.component';
import { CarouselBeautyServicesComponent } from './components/carousel-beauty-services/carousel-beauty-services.component';
import { RouterModule, Routes } from '@angular/router';


const homeRoutes: Routes = [
  { path: '', redirectTo: "/accueil", pathMatch: "full"},
  { path: 'accueil', component: HomepageComponent }
];


@NgModule({
  declarations: [
    HomepageComponent,
    BeautySalonPresentationComponent,
    WhyComeToSalonComponent,
    CarouselBeautyServicesComponent,
    SalonLocationComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(homeRoutes)
  ]
})
export class HomeModule { }
