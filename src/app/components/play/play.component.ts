import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { Subscription, combineLatest } from 'rxjs';
import { Game } from '../../models/game.model';
import { QuizService } from '../../stores/quiz.service';
import { StealsService } from '../../stores/steals.service';
import { QuizPlayComponent } from '../quiz-play/quiz-play.component';
import { StealPlayComponent } from '../steal-play/steal-play.component';

@Component({
  selector: 'app-play',
  standalone: true,
  imports: [CommonModule, QuizPlayComponent, StealPlayComponent],
  templateUrl: './play.component.html',
  styleUrl: './play.component.scss'
})
export class PlayComponent implements OnDestroy {

  private subscriptions: Subscription[] = []

  public game: 'quiz' | 'steal' | undefined

  constructor(public sQuiz: QuizService, public sSteal: StealsService) {
    const obs = combineLatest([sQuiz.quizGame$, sSteal.stealGame$])
    this.subscriptions.push(obs.subscribe(([quiz, steal]) => this.handleChanges(quiz, steal)))
  }

  handleChanges(quiz: Game | undefined, steal: Game | undefined) {
    this.game = quiz?.state !== 'finished' ? 'quiz' : 'steal'
  }



  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe())
  }

}
