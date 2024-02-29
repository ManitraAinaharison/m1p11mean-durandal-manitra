import { Component, ElementRef, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.model';
import { Router } from '@angular/router';

@Component({
    selector: 'app-dashboard-sidebar',
    templateUrl: './dashboard-sidebar.component.html',
    styleUrl: './dashboard-sidebar.component.css'
})
export class DashboardSidebarComponent implements OnInit {

    logoWrapper: HTMLElement | null = null;
    sidebarItems: HTMLElement[] = [];
    showTooltip: boolean = false;
    currentUser : User | null = null;


    constructor(
        public userService: UserService,
        private elementRef: ElementRef,
        private router: Router,
    ) {}

    ngOnInit(): void {
        this.logoWrapper = this.elementRef.nativeElement.querySelector('.logo-wrapper');
        this.sidebarItems = this.elementRef.nativeElement.querySelectorAll('.sidebar-item');

        // this.userService.getCurrentUser().subscribe((response) => {
        //   if (
        //     response &&
        //     response.payload.role &&
        //     (response.payload.role === 'EMPLOYEE' ||
        //       response.payload.role === 'MANAGER')
        //   ) {
        //     this.currentUser = response.payload;
        //   }
        //   this.currentUser = response.payload;
        // });

        this.userService.currentUser.subscribe((response) => {
            console.log(response);
          if (
            response &&
            response.role &&
            (response.role === 'EMPLOYEE' || response.role === 'MANAGER')
          ) {
            this.currentUser = response;
          }
        });
    }

    toggleSiderbar(event: MouseEvent): void{
        const compressedClass = 'compressed';
        this.elementRef.nativeElement.querySelector('.sidebar').classList.toggle(compressedClass);
        const sidebarCollapser: HTMLElement = event.currentTarget as HTMLElement;
        if (sidebarCollapser.classList.contains(compressedClass)) this.showTooltip = false;
        else this.showTooltip = true;
        sidebarCollapser.classList.toggle(compressedClass);
        this.logoWrapper!.classList.toggle(compressedClass);
        this.sidebarItems.forEach((item: HTMLElement) => {
            item.classList.toggle(compressedClass);
            item.children[0]!.querySelector('.sidebar-item .sidebar-item-label')!.classList.toggle(compressedClass);
        });
    }

    logout(){
        this.userService.targetUrl = '';
        this.userService.logout()
        this.router.navigate(['/dashboard/login'], {replaceUrl: true});
    }
}
