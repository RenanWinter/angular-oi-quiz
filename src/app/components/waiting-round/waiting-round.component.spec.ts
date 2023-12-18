import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitingRoundComponent } from './waiting-round.component';

describe('WaitingRoundComponent', () => {
  let component: WaitingRoundComponent;
  let fixture: ComponentFixture<WaitingRoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WaitingRoundComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WaitingRoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
