import { Component } from '@angular/core';
import { Event, Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { PageLoaderService } from './shared/services/page-loader.service';

@Component({
selector: 'app-root',
templateUrl: './app.component.html',
styleUrl: './app.component.css'
})
export class AppComponent {

    constructor(
        private router: Router,
        private pageLoaderService: PageLoaderService,
    ) {
        this.router.events
        .subscribe((event: Event) => {
            switch (true) {
                case event instanceof NavigationStart: {
                    this.pageLoaderService.show();
                    break;
                }

                case event instanceof NavigationEnd:
                case event instanceof NavigationCancel:
                case event instanceof NavigationError: {
                    this.pageLoaderService.hide();
                    break;
                }
                default: {
                    break;
                }
            }
        });
    }
}
