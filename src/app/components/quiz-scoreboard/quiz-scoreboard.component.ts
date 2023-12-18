import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { take } from 'rxjs';
import { confetti } from 'tsparticles-confetti';
import { ScoreboardItem } from '../../models/scoreboard-item.model';
import { QuizService } from '../../stores/quiz.service';

@Component({
  selector: 'app-quiz-scoreboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz-scoreboard.component.html',
  styleUrl: './quiz-scoreboard.component.scss'
})
export class QuizScoreboardComponent implements OnDestroy{
  public selected: ScoreboardItem | undefined
  private subscriptions: any[] = []
  constructor(public sQuiz: QuizService){
    const subs = sQuiz.rounds$.pipe(take(1)).subscribe(rounds => {
      const nextRound = rounds.find(round => round.status === 'pending')
      if (!nextRound) this.showParticles()
    })
    this.subscriptions.push(subs)
  }

  showParticles(){
    const interval = setInterval(() => {
      confetti('tsparticles', {});
    }, 600)

    setTimeout(() => {
      clearInterval(interval)
    }, 4000);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe())
  }

}
