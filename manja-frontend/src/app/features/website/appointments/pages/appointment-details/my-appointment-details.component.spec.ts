import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyAppointmentDetailsComponent } from './my-appointment-details.component';

describe('MyAppointmentDetailsComponent', () => {
  let component: MyAppointmentDetailsComponent;
  let fixture: ComponentFixture<MyAppointmentDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyAppointmentDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MyAppointmentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
