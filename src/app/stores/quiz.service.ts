import { Injectable } from '@angular/core';
import { DocumentReference, Firestore, Timestamp, addDoc, collection, collectionData, deleteDoc, doc, serverTimestamp, setDoc } from '@angular/fire/firestore';
import { Observable, combineLatest, map, take } from 'rxjs';
import { Game } from '../models/game.model';
import { Member } from '../models/members.model';
import { RoundAnswer } from '../models/round-result.model';
import { Round } from '../models/round.model';
import { ScoreboardItem } from '../models/scoreboard-item.model';
import { ModalService } from '../services/modal.service';
import { MembersService } from './members.service';
import { QuestionService } from './question.service';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  private roundsRef = collection(this.firestore, 'rounds');
  public rounds$ = (collectionData(this.roundsRef, { idField: '_id' }) as Observable<Round[]>)
    .pipe(map(this.sortRounds));

  public runningRound$ = this.rounds$.pipe(
    map(rounds => rounds.find(round => round.status === 'running'))
  )

  private answersRef = collection(this.firestore, 'answers');
  public answers$ = (collectionData(this.answersRef, { idField: '_id' }) as Observable<RoundAnswer[]>)

  private gamesRef = collection(this.firestore, 'games');
  public games$ = (collectionData(this.gamesRef, { idField: '_id' }) as Observable<Game[]>)

  public quizGame$ = this.games$.pipe(
    map(games => games.find(game => game._id === 'quiz'))
  )

  public scoreboard$ = this.rounds$.pipe(map(this.calculateScoreboard))

  public configRef = collection(this.firestore, 'configs');

  constructor(
    private firestore: Firestore,
    private sMembers: MembersService,
    private sQuestion: QuestionService,
    private modal: ModalService
  ) { }

  start() {
    combineLatest([this.sMembers.participants$, this.sQuestion.questions$, this.answers$])
      .pipe(take(1))
      .subscribe(([members, questions]) => {
        questions.forEach(question => {
          const round: Round = {
            question: question,
            results: [],
            members,
            status: 'pending',
          }
          addDoc(this.roundsRef, round)
        })
        const quizRef = doc(this.gamesRef, 'quiz')
        setDoc(quizRef, { state: 'waiting' }, { merge: true })
      })
  }

  async clearRoundCollection() {
    const confirm = await this.confirmClear()
    if (!confirm) return
    return new Promise<void>((resolve) => {
      combineLatest([this.rounds$, this.answers$]).pipe(take(1)).subscribe(async ([rounds, answers]) => {
        let operations: Promise<void>[] = []
        for (let round of rounds) {
          operations.push(deleteDoc(doc(this.roundsRef, round._id)))
        }

        for (let answer of answers) {
          operations.push(deleteDoc(doc(this.answersRef, answer._id)))
        }

        const quizRef = doc(this.gamesRef, 'quiz')
        operations.push(setDoc(quizRef, { state: 'configuring' }, { merge: true }))

        await Promise.all(operations)
        resolve()
      })
    })
  }

  confirmClear() {
    return new Promise(resolve => {
      this.modal.show({
        title: 'Atenção!',
        content: 'EXCLUIR TUDO?',
        actions: [
          {
            color: 'success',
            text: 'Não',
            closeOnClick: true,
            handler: () => {
              resolve(false)
            }
          },
          {
            color: 'error',
            text: 'Sim',
            closeOnClick: true,
            handler: () => {
              resolve(true)
            }
          }
        ]

      })

    })
  }

  clearAnswers() {
    return new Promise<void>((resolve) => {
      this.answers$.pipe(take(1)).subscribe(async (answers) => {
        let operations: Promise<void>[] = []
        for (let answer of answers) {
          operations.push(deleteDoc(doc(this.answersRef, answer._id)))
        }
        await Promise.all(operations)
        resolve()
      })
    })
  }

  private sortRounds(rounds: Round[]) {
    return rounds.sort((a, b) => a.question.order - b.question.order)
  }

  async startRound(round: Round) {
    const roundRef = doc(this.roundsRef, round._id)
    await setDoc(roundRef, { status: 'running', startedAt: serverTimestamp() }, { merge: true })

    const quizRef = doc(this.gamesRef, 'quiz')
    setDoc(quizRef, { state: 'running' }, { merge: true })
  }

  async endRound() {

    combineLatest([this.runningRound$, this.answers$]).pipe(take(1)).subscribe(async ([round, answers]) => {
      const roundRef = doc(this.roundsRef, round!._id)
      await setDoc(roundRef, {
        status: 'finished',
        endedAt: serverTimestamp(),
        results: answers
      }, { merge: true })

      const quizRef = doc(this.gamesRef, 'quiz')
      setDoc(quizRef, { state: 'stopped' }, { merge: true })
      this.clearAnswers()
    })
  }

  async terminateGame(){
    const quizRef = doc(this.gamesRef, 'quiz')
    await setDoc(quizRef, { state: 'finished' }, { merge: true })
  }

  calculateScoreboard(rounds: Round[]): ScoreboardItem[] {
    rounds = rounds.filter(round => round.status === 'finished')
    let members: Member[] = []
    rounds.forEach(round => {
      round.members.forEach(member => {
        if (!members.find(m => m._id === member._id)) {
          members.push(member)
        }
      })
    })

    let roundsByOrder = [...rounds].sort((a, b) => a.question.order - b.question.order)

    let scoreboard = members.map(member => {
      let memberPoints = 0
      let points = roundsByOrder.map(round => {
        let result = round.results.find(result => result.member._id === member._id)
        if (!result) {
          return 'X'
        }
        memberPoints += result.points || 0
        return result.points?.toString() || ''
      })

      return {
        position: 0,
        member: member.name,
        memberRef: member,
        rounds: points,
        totalStr: memberPoints.toString(),
        totalInt: memberPoints
      }
    })
    scoreboard.sort((a, b) => b.totalInt - a.totalInt)
    scoreboard = scoreboard.map((item, index) => {
      return {
        ...item,
        position: index + 1
      }
    })
    return scoreboard
  }

  async showScoreboard() {
    const quizRef = doc(this.gamesRef, 'quiz')
    setDoc(quizRef, { state: 'scoreboard' }, { merge: true })
  }

  async closeScoreboard() {
    const quizRef = doc(this.gamesRef, 'quiz')
    setDoc(quizRef, { state: 'waiting' }, { merge: true })
  }

  answer(result: RoundAnswer) {
    const ref = doc(this.answersRef, result._id)
    setDoc(ref, result)
  }

  async createAnswer(member: Member, round: Round) {
    return new Promise(resolve => {
      this.answers$.pipe(take(1)).subscribe(async answers => {
        const hasAnswer = answers.find(answer => answer.member._id === member._id)
        if (!hasAnswer) {
          const result: RoundAnswer = {
            member,
            startedAt: Timestamp.now(),
          }
          await addDoc(this.answersRef, result) as DocumentReference<RoundAnswer>
        }
        resolve(true)
      })
    })

  }
}
