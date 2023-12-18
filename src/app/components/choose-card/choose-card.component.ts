import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy } from '@angular/core';
import { Subscription, combineLatest } from 'rxjs';
import { Present } from '../../models/present.model';
import { MembersService } from '../../stores/members.service';
import { StealsService } from '../../stores/steals.service';
import { PresentCardComponent } from '../present-card/present-card.component';

@Component({
  selector: 'app-choose-card',
  standalone: true,
  imports: [CommonModule, PresentCardComponent],
  templateUrl: './choose-card.component.html',
  styleUrl: './choose-card.component.scss',
})
export class ChooseCardComponent implements OnDestroy {

  @Input() chosen!: number;
  @Input() present: Present | undefined

  title = ''
  private subscriptions: Subscription[] = []
  constructor(public sSteal: StealsService, private sMember: MembersService) {
    const subs = combineLatest([sSteal.currentRound$, sMember.member$]).subscribe(([round, member]) => {
      if (round?.member._id === member?._id) {
        this.title = 'Escolha o seu presente!'
      } else {
        this.title = round?.member.name + ' está escolhendo o presente...'
      }
    })
    this.subscriptions.push(subs)

  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe())
  }
}
