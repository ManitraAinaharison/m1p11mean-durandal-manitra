import { JwtService } from './../../../services/jwt.service';
import { UserService } from './../../../services/user.service';
import { AfterContentInit, AfterViewInit, Component, DestroyRef, ElementRef, HostListener, OnChanges, OnInit, Renderer2, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { ApiError, ApiSuccess } from '../../../models/api.model';
import { CookieService } from 'ngx-cookie-service';

@Component({
    selector: 'app-website-navbar',
    templateUrl: './website-navbar.component.html',
    styleUrl: './website-navbar.component.css',
})
export class WebsiteNavbarComponent implements OnInit, AfterViewInit {

    logoUrl: string = 'assets/img/logo.svg';
    dropdownToggles: HTMLElement[]  = [];

    destroyRef = inject(DestroyRef);

    constructor(
        private elementRef: ElementRef,
        private renderer: Renderer2,
        public userService: UserService,
        private router: Router,
        private jwtService: JwtService
    ) {}

    ngOnInit(): void {
      this.dropdownToggles = this.elementRef.nativeElement.querySelectorAll('.dropdown-toggle');
      if (this.jwtService.getAccessToken() && this.jwtService.getRefreshToken()) {
        this.userService
        .getCurrentUser()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (res: ApiSuccess) => {
            this.userService.setAuth(res.payload);
          },
          error: (err: ApiError) => {
            this.userService.errorMessage = err.message;
            this.router.navigate(["/login"]);
          }
        });
      } else {
        this.jwtService.destroyTokens();
      }
    }

    ngAfterViewInit() {
        this.updateDropdownTogglesWhenUserChanges();
    }

    @HostListener('document:click', ['$event'])
    onClick(event: MouseEvent) {
        let isDropdownClick = false;
        for (let i = 0; i < this.dropdownToggles.length; i++) {
            const dropdownToggle = this.dropdownToggles[i];
            if (dropdownToggle.contains(event.target as Node) || dropdownToggle.nextElementSibling?.contains(event.target as Node)) {
                isDropdownClick = true;
                break;
            }
        }
        if (!isDropdownClick) this.closeAllNavbarDropdowns();
    }

    closeAllNavbarDropdowns(): void {
        this.dropdownToggles.forEach((toggle: HTMLElement) => {
            this.renderer.removeClass(toggle.nextElementSibling, 'active');
            this.renderer.removeClass(toggle.children[1], 'active');
        });
    }

    openDropdown(event: MouseEvent) {
        const targetDropdownToggle: HTMLElement = event.currentTarget as HTMLElement;
        this.dropdownToggles.forEach((dropdownToggle: HTMLElement) => {
            if (dropdownToggle === targetDropdownToggle) {
                if(targetDropdownToggle!.nextElementSibling!.classList.contains('active')) {
                    this.renderer.removeClass(targetDropdownToggle!.nextElementSibling!, 'active');
                    this.renderer.removeClass(targetDropdownToggle.children[1], 'active');
                } else {
                    this.renderer.addClass(targetDropdownToggle!.nextElementSibling!, 'active');
                    this.renderer.addClass(targetDropdownToggle.children[1], 'active');
                }
            } else {
                this.renderer.removeClass(dropdownToggle!.nextElementSibling!, 'active');
                this.renderer.removeClass(dropdownToggle.children[1], 'active');
            }
        });
    }

    updateDropdownTogglesWhenUserChanges() {
      this.userService
      .currentUser
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
          next: () => {
            this.dropdownToggles = this.elementRef.nativeElement.querySelectorAll('.dropdown-toggle');
          }
      });
    }

    logout() {
        this.userService.logout();
    }
}
