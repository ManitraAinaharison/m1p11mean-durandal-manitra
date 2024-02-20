import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-beauty-salon-presentation',
  templateUrl: './beauty-salon-presentation.component.html',
  styleUrl: './beauty-salon-presentation.component.css'
})
export class BeautySalonPresentationComponent {
  
  constructor(private router: Router) {}

  public redirectToListServices() {
    this.router.navigate(['/services']);
  }
}
