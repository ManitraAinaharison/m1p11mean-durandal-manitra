import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfitCalculationComponent } from './profit-calculation.component';

describe('ProfitCalculationComponent', () => {
  let component: ProfitCalculationComponent;
  let fixture: ComponentFixture<ProfitCalculationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfitCalculationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProfitCalculationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
