import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
    selector: 'app-dashboard-sidebar',
    templateUrl: './dashboard-sidebar.component.html',
    styleUrl: './dashboard-sidebar.component.css'
})
export class DashboardSidebarComponent implements OnInit {

    logoWrapper: HTMLElement | null = null;
    sidebarItems: HTMLElement[] = [];
    showTooltip: boolean = false;

    constructor(
        private elementRef: ElementRef
    ) {}

    ngOnInit(): void {
        this.logoWrapper = this.elementRef.nativeElement.querySelector('.logo-wrapper');
        this.sidebarItems = this.elementRef.nativeElement.querySelectorAll('.sidebar-item');
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
}
