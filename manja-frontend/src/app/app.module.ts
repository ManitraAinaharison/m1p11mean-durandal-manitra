import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { ApiInterceptor } from './core/interceptors/api.interceptor';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';
import { TokenInterceptor } from './core/interceptors/token.interceptor';

// Modules import
import { LayoutsModule } from './core/layouts/layouts.module';
import { PageLoaderComponent } from './shared/components/page-loader/page-loader.component';
import { SharedPipesModule } from './shared/pipes/shared-pipes.module';
import { ConfirmBoxComponent } from './shared/components/confirm-box/confirm-box.component';
import { MatDialogModule } from '@angular/material/dialog';



@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    PageLoaderComponent,
    ConfirmBoxComponent
  ],
  imports: [
    BrowserModule,
    MatDialogModule,
    HttpClientModule,
    LayoutsModule,
    SharedPipesModule,
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
