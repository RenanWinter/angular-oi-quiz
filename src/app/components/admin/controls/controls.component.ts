import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { Subscription, combineLatest } from 'rxjs';
import { QuizService } from '../../../stores/quiz.service';
import { StealsService } from '../../../stores/steals.service';
import { QuizControlsComponent } from './quiz-controls/quiz-controls.component';
import { StealControlsComponent } from './steal-controls/steal-controls.component';

@Component({
  selector: 'app-controls',
  standalone: true,
  imports: [CommonModule, QuizControlsComponent, StealControlsComponent],
  templateUrl: './controls.component.html',
  styleUrl: './controls.component.scss'
})
export class ControlsComponent implements OnDestroy {

  private subscriptions: Subscription[] = []

  public game: 'quiz' | 'steals' = 'quiz'
  constructor(public sQuiz: QuizService, private sSteals: StealsService) {
    const obs = combineLatest([sQuiz.quizGame$, sSteals.stealGame$])
    this.subscriptions.push(obs.subscribe(([quiz, steals]) => {
        if (quiz?.state !== 'finished'){
          this.game = 'quiz'
        } else {
          this.game = 'steals'
        }
    }))
  }


  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe())
  }


}
