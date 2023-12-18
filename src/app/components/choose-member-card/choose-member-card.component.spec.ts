import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseMemberCardComponent } from './choose-member-card.component';

describe('ChooseMemberCardComponent', () => {
  let component: ChooseMemberCardComponent;
  let fixture: ComponentFixture<ChooseMemberCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChooseMemberCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChooseMemberCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
