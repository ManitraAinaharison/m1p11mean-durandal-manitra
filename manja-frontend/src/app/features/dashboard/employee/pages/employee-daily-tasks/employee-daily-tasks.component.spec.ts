import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeDailyTasksComponent } from './employee-daily-tasks.component';

describe('EmployeeAppointmentsComponent', () => {
  let component: EmployeeDailyTasksComponent;
  let fixture: ComponentFixture<EmployeeDailyTasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmployeeDailyTasksComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmployeeDailyTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
