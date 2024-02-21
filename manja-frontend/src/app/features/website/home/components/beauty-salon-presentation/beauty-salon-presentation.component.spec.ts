import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeautySalonPresentationComponent } from './beauty-salon-presentation.component';

describe('BeautySalonPresentationComponent', () => {
  let component: BeautySalonPresentationComponent;
  let fixture: ComponentFixture<BeautySalonPresentationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BeautySalonPresentationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BeautySalonPresentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
