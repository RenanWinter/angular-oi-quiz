import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoppedRoundComponent } from './stopped-round.component';

describe('StoppedRoundComponent', () => {
  let component: StoppedRoundComponent;
  let fixture: ComponentFixture<StoppedRoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoppedRoundComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StoppedRoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
