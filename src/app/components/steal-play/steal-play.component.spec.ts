import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StealPlayComponent } from './steal-play.component';

describe('StealPlayComponent', () => {
  let component: StealPlayComponent;
  let fixture: ComponentFixture<StealPlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StealPlayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StealPlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
