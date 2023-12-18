import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StealWaitingListComponent } from './steal-waiting-list.component';

describe('StealWaitingListComponent', () => {
  let component: StealWaitingListComponent;
  let fixture: ComponentFixture<StealWaitingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StealWaitingListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StealWaitingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
