import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { Subscription, combineLatest } from 'rxjs';
import { MembersService } from '../../stores/members.service';
import { StealsService } from '../../stores/steals.service';
import { PresentCardComponent } from '../present-card/present-card.component';

@Component({
  selector: 'app-choose-member',
  standalone: true,
  imports: [CommonModule, PresentCardComponent],
  templateUrl: './choose-member.component.html',
  styleUrl: './choose-member.component.scss'
})
export class ChooseMemberComponent implements OnDestroy{

  private subscriptions: Subscription[] = []
  public title = ''

  public canPlay: boolean = false

  constructor(public sSteal: StealsService, private sMember: MembersService){
    const subs = combineLatest([sSteal.currentRound$, sSteal.rounds$, sMember.member$]).subscribe(([round, rounds, member]) => {
      this.canPlay = round?.member._id === member?._id || member?.isAdmin || false
    })
    this.subscriptions.push(subs)
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe())
  }
}
