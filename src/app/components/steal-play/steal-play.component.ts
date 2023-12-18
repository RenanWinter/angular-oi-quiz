import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MembersService } from '../../stores/members.service';
import { StealsService } from '../../stores/steals.service';
import { ChooseCardComponent } from '../choose-card/choose-card.component';
import { StealFinishedRoundComponent } from '../steal-finished-round/steal-finished-round.component';
import { WaitingRoundComponent } from '../waiting-round/waiting-round.component';
import { ChooseMemberComponent } from './../choose-member/choose-member.component';

@Component({
  selector: 'app-steal-play',
  standalone: true,
  imports: [CommonModule, WaitingRoundComponent, ChooseCardComponent, ChooseMemberComponent, StealFinishedRoundComponent],
  templateUrl: './steal-play.component.html',
  styleUrl: './steal-play.component.scss'
})
export class StealPlayComponent  implements OnDestroy{

  private subscriptions: Subscription[] = []
  constructor(public sSteal: StealsService, private sMember: MembersService){


  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe())
  }

}
