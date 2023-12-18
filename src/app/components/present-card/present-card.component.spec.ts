import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PresentCardComponent } from './present-card.component';

describe('PresentCardComponent', () => {
  let component: PresentCardComponent;
  let fixture: ComponentFixture<PresentCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PresentCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PresentCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
