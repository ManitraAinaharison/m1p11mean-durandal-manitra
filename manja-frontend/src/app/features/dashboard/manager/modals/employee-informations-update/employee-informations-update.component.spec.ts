import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeInformationsUpdateComponent } from './employee-informations-update.component';

describe('EmployeeInformationsUpdateComponent', () => {
  let component: EmployeeInformationsUpdateComponent;
  let fixture: ComponentFixture<EmployeeInformationsUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmployeeInformationsUpdateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmployeeInformationsUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
