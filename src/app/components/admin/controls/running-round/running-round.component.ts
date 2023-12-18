import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy } from '@angular/core';
import { Subscription, combineLatest } from 'rxjs';
import { GameStatus } from '../../../../models/game.model';
import { Round } from '../../../../models/round.model';
import { QuizService } from '../../../../stores/quiz.service';

@Component({
  selector: 'app-running-round',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './running-round.component.html',
  styleUrl: './running-round.component.scss'
})
export class RunningRoundComponent implements OnDestroy {

  @Input() round!: Round

  public state: GameStatus = 'running'
  public allAnswered = false


  public table: {
    name: string,
    answer: string,
    answerType: 'W' | 'C' | 'I',
    points: string

  }[] = []

  private subscriptions: Subscription[] = []

  constructor(public sQuiz: QuizService) {
    const sub = combineLatest([sQuiz.answers$,sQuiz.quizGame$]).subscribe(([answers, game]) => {
      this.state = game?.state ?? 'configuring'
      let total = this.round.members.length
      let responded = answers.filter(answer => answer.endedAt).length

      if (responded === total) {
        this.allAnswered = true
      }
      this.table = this.round.members.map(member => {
        const answer = answers.find(answer => answer.member._id === member._id)
        let icon: 'W' | 'C' | 'I' = 'W'
        if (answer?.endedAt) {
          icon = answer.answeredCorrectly ? 'C' : 'I'
        }
        return {
          name: member.name,
          answer: answer?.answer ?? '',
          answerType: icon,
          points: '' + (answer?.points ?? '')
        }
      })
    })
    this.subscriptions.push(sub)
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe())
  }
}
