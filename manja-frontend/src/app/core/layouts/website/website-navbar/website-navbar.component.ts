import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-website-navbar',
  templateUrl: './website-navbar.component.html',
  styleUrl: './website-navbar.component.css',
})
export class WebsiteNavbarComponent {
  logoUrl: string = 'assets/img/logo.svg';

  constructor(private router: Router) {}

  public redirectToListServices() {
    this.router.navigate(['/service']);
  }
}
