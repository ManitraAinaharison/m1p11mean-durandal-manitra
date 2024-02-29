import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEbitComponent } from './list-ebit.component';

describe('ListEbitComponent', () => {
  let component: ListEbitComponent;
  let fixture: ComponentFixture<ListEbitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListEbitComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListEbitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
