import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { Subscription, combineLatest } from 'rxjs';
import { Game, GameStatus } from '../../models/game.model';
import { RoundAnswer } from '../../models/round-result.model';
import { Round } from '../../models/round.model';
import { MembersService } from '../../stores/members.service';
import { QuizService } from '../../stores/quiz.service';
import { NotStartedGameComponent } from '../not-started-game/not-started-game.component';
import { QuizScoreboardComponent } from '../quiz-scoreboard/quiz-scoreboard.component';
import { RoundResultComponent } from '../round-result/round-result.component';
import { StoppedRoundComponent } from '../stopped-round/stopped-round.component';
import { WaitingRoundComponent } from '../waiting-round/waiting-round.component';

@Component({
  selector: 'app-quiz-play',
  standalone: true,
  imports: [CommonModule, NotStartedGameComponent, WaitingRoundComponent, QuizScoreboardComponent, StoppedRoundComponent, RoundResultComponent],
  templateUrl: './quiz-play.component.html',
  styleUrl: './quiz-play.component.scss'
})
export class QuizPlayComponent {
  private subscriptions: Subscription[] = []
  public member = this.sMember.getMe()
  public answer: RoundAnswer | undefined

  public state: GameStatus | undefined
  public roundState: 'responding' | 'processing' | 'responded' = 'responding'
  public currentRound: Round | undefined

  constructor(public sMember: MembersService, public sQuiz: QuizService) {
    const obs = combineLatest([sQuiz.rounds$, sQuiz.answers$, sQuiz.runningRound$, sQuiz.quizGame$])
    this.subscriptions.push(obs.subscribe(([rounds, answers, running, game]) => this.handleChanges(rounds, answers, running, game)))
  }

  async handleChanges(rounds: Round[], answers: RoundAnswer[], running: Round | undefined, game: Game | undefined) {
    this.currentRound = running
    this.state = game?.state ?? 'configuring'
    if (answers && answers.length > 0) {
      this.answer = answers.find(answer => answer.member._id === this.member?._id)
    } else {
      this.answer = undefined
    }
    if (running?.status === 'running' && !this.answer) {
      await this.sQuiz.createAnswer(this.member!, running)
      this.currentRound = running
      this.roundState = 'responding'
    } else if (running && !this.answer?.endedAt) {
      this.roundState = 'responding'
    } else if (running && this.answer?.endedAt) {
      this.roundState = 'responded'
    }

  }

  async respond(answer: string) {
    if (!this.currentRound) return
    const startedAt = this.answer?.startedAt!
    const endedAt = Timestamp.now()
    const secondsToAnswer = endedAt.seconds - startedAt?.seconds
    const answeredCorrectly = answer === this.currentRound.question.answer
    let points = 0
    if (answeredCorrectly) {
      points = this.currentRound.question.points - (secondsToAnswer * (this.currentRound.question.points / 1000))
      if (points < 0) points = 0
    }

    let result: RoundAnswer = {
      ...this.answer,
      member: this.member!,
      startedAt,
      endedAt: endedAt,
      answer,
      answeredCorrectly,
      secondsToAnswer,
      points
    }
    this.sQuiz.answer(result)

  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe())
  }
}
