import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEbitComponent } from './edit-ebit.component';

describe('EditEbitComponent', () => {
  let component: EditEbitComponent;
  let fixture: ComponentFixture<EditEbitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditEbitComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditEbitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
