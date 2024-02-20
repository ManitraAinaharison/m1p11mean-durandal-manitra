import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebsiteNavbarComponent } from './components/website-navbar/website-navbar.component';
import { WebsiteFooterComponent } from './components/website-footer/website-footer.component';
import { WebsiteLayoutComponent } from './pages/website-layout/website-layout.component';
import { DashboardLayoutComponent } from './pages/dashboard-layout/dashboard-layout.component';
import { AppRoutingModule } from '../../app-routing.module';
import { IfAuthenticatedDirective } from '../../shared/directives/if-authenticated.directive';



@NgModule({
  declarations: [
    WebsiteLayoutComponent,
    DashboardLayoutComponent,
    WebsiteNavbarComponent,
    WebsiteFooterComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    IfAuthenticatedDirective
  ]
})
export class LayoutsModule { }
