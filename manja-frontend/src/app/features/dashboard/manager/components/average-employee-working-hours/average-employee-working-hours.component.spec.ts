import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AverageEmployeeWorkingHoursComponent } from './average-employee-working-hours.component';

describe('AverageEmployeeWorkingHoursComponent', () => {
  let component: AverageEmployeeWorkingHoursComponent;
  let fixture: ComponentFixture<AverageEmployeeWorkingHoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AverageEmployeeWorkingHoursComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AverageEmployeeWorkingHoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
