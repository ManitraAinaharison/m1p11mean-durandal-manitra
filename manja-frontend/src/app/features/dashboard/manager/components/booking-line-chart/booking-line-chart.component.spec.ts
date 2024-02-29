import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingLineChartComponent } from './booking-line-chart.component';

describe('BookingLineChartComponent', () => {
  let component: BookingLineChartComponent;
  let fixture: ComponentFixture<BookingLineChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BookingLineChartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BookingLineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
