import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { Subscription, combineLatest } from 'rxjs';
import { Present } from '../../../../models/present.model';
import { PresentsService } from '../../../../stores/presents.service';
import { QuizService } from '../../../../stores/quiz.service';
import { StealsService } from '../../../../stores/steals.service';

@Component({
  selector: 'app-steal-waiting-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './steal-waiting-list.component.html',
  styleUrl: './steal-waiting-list.component.scss'
})
export class StealWaitingListComponent implements OnDestroy{

  private subscriptions: Subscription[] = [];

  public cards: Present[] = []

  constructor(public sSteal: StealsService, private sPresent: PresentsService, private sQuiz: QuizService){
    const subs = combineLatest([sSteal.stealGame$, sPresent.presents$, sSteal.rounds$]).subscribe(([stealGame, presents, scoreboard]) => {
      console.log(stealGame, presents, scoreboard)
    })
    this.subscriptions.push(subs)
  }

  ngOnDestroy(){
    this.subscriptions.forEach(s => s.unsubscribe())
  }

}
