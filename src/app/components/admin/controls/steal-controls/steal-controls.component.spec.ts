import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StealControlsComponent } from './steal-controls.component';

describe('StealControlsComponent', () => {
  let component: StealControlsComponent;
  let fixture: ComponentFixture<StealControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StealControlsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StealControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
