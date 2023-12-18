import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, setDoc } from '@angular/fire/firestore';
import { Observable, combineLatest, map, take } from 'rxjs';
import { Game } from '../models/game.model';
import { Present } from '../models/present.model';
import { StealRound } from '../models/steal-round.model';
import { MembersService } from './members.service';
import { PresentsService } from './presents.service';
import { QuizService } from './quiz.service';

@Injectable({
  providedIn: 'root'
})
export class StealsService {

  private gamesRef = collection(this.firestore, 'games');
  public games$ = (collectionData(this.gamesRef, { idField: '_id' }) as Observable<Game[]>)
  public stealGame$ = this.games$.pipe(
    map(games => games.find(game => game._id === 'steals'))
  )

  public roundsRef = collection(this.firestore, 'steal-rounds');
  public rounds$ = (collectionData(this.roundsRef, { idField: '_id' }) as Observable<StealRound[]>)
    .pipe(map(rounds => [...rounds].sort((a, b) => a.order - b.order)))

  public availablepresents$ = combineLatest([this.rounds$, this.sPresents.presents$]).pipe(
    map(([rounds, presents]) => {
      const userPresents = rounds.filter(round => !!round.present).map(round => round.present as Present)
      return presents.filter(present => !userPresents.find(p => p._id === present._id))
    })
  )

  public currentRound$ = this.rounds$.pipe(
    map(rounds => rounds.find(round => ['choosing-card', 'choosing-member', 'finished'].includes(round.status)))
  )

  public runnedRounds$ = this.rounds$.pipe(
    map(rounds => rounds.filter(round => round.status === 'terminated'))
  )

  constructor(
    private firestore: Firestore,
    private sQuiz: QuizService,
    private sPresents: PresentsService,
    private sMember: MembersService,
  ) { }

  async configureGame() {
    this.sQuiz.scoreboard$.pipe(take(1)).subscribe(scoreboard => {
      const stealMemebers = [...scoreboard].reverse()
      const stealRounds: StealRound[] = stealMemebers.map((board, index) => {
        return {
          member: board.memberRef,
          status: 'pending',
          order: index + 1,
          isNext: index === 0,
        }
      })

      stealRounds.forEach(round => {
        addDoc(this.roundsRef, round)
      })

      const gameRef = doc(this.gamesRef, 'steals')
      setDoc(gameRef, { state: 'waiting' })

    })
  }

  async deleteRounds() {
    this.rounds$.pipe(take(1)).subscribe(rounds => {
      rounds.forEach(round => {
        const ref = doc(this.roundsRef, round._id)
        deleteDoc(ref)
      })
    })
  }

  async chooseCard(round: StealRound) {
    const gameRef = doc(this.gamesRef, 'steals')
    const roundRef = doc(this.roundsRef, round._id)
    setDoc(gameRef, { state: 'running' })
    setDoc(roundRef, { status: 'choosing-card' }, { merge: true })
  }

  async selectPresent(present: Present) {
    const member = this.sMember.getMe()
    this.currentRound$.pipe(take(1)).subscribe(currentRound => {
      if (currentRound?.member._id !== member?._id && !member?.isAdmin) return
      setDoc(doc(this.roundsRef, currentRound?._id), { present, picked: present, status: 'choosing-member' }, { merge: true })
    })

  }

  async keepPresent() {
    const member = this.sMember.getMe()
    this.currentRound$.pipe(take(1)).subscribe(currentRound => {
      if (currentRound?.member._id !== member?._id && !member?.isAdmin) return
      setDoc(doc(this.roundsRef, currentRound?._id), { status: 'finished' }, { merge: true })
    })

  }

  async stealpresent(fromRound: StealRound) {
    const member = this.sMember.getMe()
    this.currentRound$.pipe(take(1)).subscribe(currentRound => {
      if (currentRound?.member._id !== member?._id && !member?.isAdmin) return
      setDoc(doc(this.roundsRef, currentRound?._id), { status: 'finished', present: fromRound.present, stolenBy: fromRound.member }, { merge: true })
      setDoc(doc(this.roundsRef, fromRound._id), { present: currentRound?.picked }, { merge: true })
    })

  }

  async terminateRound() {
    const member = this.sMember.getMe()
    this.currentRound$.pipe(take(1)).subscribe(currentRound => {
      if (!member?.isAdmin) return
      setDoc(doc(this.roundsRef, currentRound?._id), { status: 'terminated', isNext: false }, { merge: true })

      this.rounds$.pipe(take(1)).subscribe(rounds => {
        const nextRound = rounds.find(round => round.order === currentRound?.order! + 1)
        if (nextRound) {
          setDoc(doc(this.roundsRef, nextRound._id), { isNext: true }, { merge: true })
        }

      })

      setDoc(doc(this.gamesRef, 'steals'), { state: 'waiting' }, { merge: true })

    })

  }

  async deleteGame() {
    await this.deleteRounds()
    const quizRef = doc(this.gamesRef, 'quiz')
    setDoc(quizRef, { state: 'waiting' }, { merge: true })

    const stealRef = doc(this.gamesRef, 'steals')
    deleteDoc(stealRef)


  }


}
