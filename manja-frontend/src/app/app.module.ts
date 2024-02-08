import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WebsiteNavbarComponent } from './core/layouts/website/website-navbar/website-navbar.component';
import { WebsiteFooterComponent } from './core/layouts/website/website-footer/website-footer.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';

// Modules import
import { HomeModule } from './features/home/home.module';
import { ServiceModule } from './features/service/service.module';


@NgModule({
  declarations: [
    AppComponent,
    WebsiteNavbarComponent,
    WebsiteFooterComponent,
    NotFoundComponent,
  ],
  imports: [
    BrowserModule,
    HomeModule,
    ServiceModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
