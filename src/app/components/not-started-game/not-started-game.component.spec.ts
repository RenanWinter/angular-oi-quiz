import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotStartedGameComponent } from './not-started-game.component';

describe('NotStartedGameComponent', () => {
  let component: NotStartedGameComponent;
  let fixture: ComponentFixture<NotStartedGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotStartedGameComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NotStartedGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
