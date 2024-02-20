import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhyComeToSalonComponent } from './why-come-to-salon.component';

describe('WhyComeToSalonComponent', () => {
  let component: WhyComeToSalonComponent;
  let fixture: ComponentFixture<WhyComeToSalonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WhyComeToSalonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WhyComeToSalonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
