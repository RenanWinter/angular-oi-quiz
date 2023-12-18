import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { Subscription, combineLatest } from 'rxjs';
import { GameStatus } from '../../../../models/game.model';
import { ModalAction } from '../../../../models/modal.model';
import { RoundAnswer } from '../../../../models/round-result.model';
import { Round } from '../../../../models/round.model';
import { QuestionService } from '../../../../stores/question.service';
import { QuizService } from '../../../../stores/quiz.service';
import { StealsService } from '../../../../stores/steals.service';
import { QuizScoreboardComponent } from '../../../quiz-scoreboard/quiz-scoreboard.component';
import { RunningRoundComponent } from '../running-round/running-round.component';
import { TableRecord, TableRecordStatus } from '../table-record.model';

@Component({
  selector: 'app-quiz-controls',
  standalone: true,
  imports: [CommonModule, RunningRoundComponent, QuizScoreboardComponent],
  templateUrl: './quiz-controls.component.html',
  styleUrl: './quiz-controls.component.scss'
})
export class QuizControlsComponent implements OnDestroy {

  private subscriptions: Subscription[] = []

  public status: GameStatus = 'configuring';

  public rounds: TableRecord[] = []

  public runningRound: Round | undefined

  public nextRound: Round | undefined

  constructor(public sQuiz: QuizService, public sQuestion: QuestionService, private sSteals: StealsService) {
    const obs = combineLatest([sQuiz.rounds$, sQuiz.answers$, sQuiz.quizGame$])
    this.subscriptions.push(obs.subscribe(([rounds, round, game]) => {
      this.status = game?.state ?? 'configuring'
      this.dataChanged(rounds, round)
    }))
  }

  dataChanged(rounds: Round[], answers: RoundAnswer[]) {

    const runningRound = rounds.find(round => round.status === 'running')
    this.nextRound = rounds.find(round => round.status === 'pending')
    this.runningRound = runningRound
    if (runningRound) this.status = 'running'

    this.rounds = rounds.map(round => {
      const { question } = round
      let status: TableRecordStatus = 'fa fa-times';
      let actions: ModalAction[] = []


      if (round.status === 'running') status = 'fa fa-clock spin'
      if (round.status === 'finished') status = 'fa fa-check'


      if (!runningRound && this.nextRound?._id === round._id) {
        status = 'fa fa-clock'
        actions.push({
          color: 'primary',
          text: 'Iniciar',
          handler: () => {
            this.sQuiz.startRound(round)
          }
        })
      }

      return {
        round,
        answers,
        question: question.question,
        answer: question.answer,
        points: question.points,
        corrects: round.results.filter(result => result.answer === question.answer).length,
        incorrects: round.results.filter(result => result.answer !== question.answer).length,
        status,
        actions
      }
    })
  }


  async terminateQuiz(){
    await this.sQuiz.terminateGame()
    await this.sSteals.configureGame()
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe())
  }


}
