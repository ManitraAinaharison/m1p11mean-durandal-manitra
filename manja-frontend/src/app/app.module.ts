import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WebsiteNavbarComponent } from './core/layouts/website/website-navbar/website-navbar.component';
import { WebsiteFooterComponent } from './core/layouts/website/website-footer/website-footer.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { ApiInterceptor } from './core/interceptors/api.interceptor';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';
import { TokenInterceptor } from './core/interceptors/token.interceptor';

// Modules import
import { HomeModule } from './features/home/home.module';
import { ServiceModule } from './features/service/service.module';
import { CustomerAuthenticationModule } from './features/customer-authentication/customer-authentication.module';


@NgModule({
  declarations: [
    AppComponent,
    WebsiteNavbarComponent,
    WebsiteFooterComponent,
    NotFoundComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    CustomerAuthenticationModule,
    HomeModule,
    ServiceModule,
    AppRoutingModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
