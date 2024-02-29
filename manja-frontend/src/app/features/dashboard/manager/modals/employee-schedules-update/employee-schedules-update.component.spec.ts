import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeSchedulesUpdateComponent } from './employee-schedules-update.component';

describe('EmployeeSchedulesUpdateComponent', () => {
  let component: EmployeeSchedulesUpdateComponent;
  let fixture: ComponentFixture<EmployeeSchedulesUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmployeeSchedulesUpdateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmployeeSchedulesUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
