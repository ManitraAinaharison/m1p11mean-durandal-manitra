import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarouselBeautyServicesComponent } from './carousel-beauty-services.component';

describe('CarouselBeautyServicesComponent', () => {
  let component: CarouselBeautyServicesComponent;
  let fixture: ComponentFixture<CarouselBeautyServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CarouselBeautyServicesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CarouselBeautyServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
