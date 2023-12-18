import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, setDoc } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, map, take } from 'rxjs';
import { Member } from '../models/members.model';

@Injectable({ providedIn: 'root' })
export class MembersService {

  private memberCollection = collection(this.firestore, 'members');

  public members$ = collectionData(this.memberCollection, { idField: '_id' }) as Observable<Member[]>;

  public participants$ = this.members$.pipe(
    map(members => members.filter(member => !member.isAdmin).sort((a, b) => a.name.localeCompare(b.name)))
  )

  private _member$ = new BehaviorSubject<Member | undefined>(undefined);
  public member$ = this._member$.asObservable()

  private members: Member[] = []

  constructor(private firestore: Firestore) {
    this.members$.subscribe(members => this.members = members);
  }

  public getMe() {
    return this._member$.getValue();
  }

  public async loadMember(code: string) {
    return new Promise<Member>(async (resolve, reject) => {
      this.members$.pipe(take(1)).subscribe(members => {
        const member = members.find(member => member.code === code)
        if (!member) {
          reject(new Error('Não localizei este código! Tente novamente!'))
          return;
        }
        this._member$.next(member)
        resolve(member)
      })
    })
  }

  public async deleteMember(member: Member) {
    const ref = doc(this.memberCollection, member._id)
    deleteDoc(ref)
  }

  public async editMember(member: Member) {
    const ref = doc(this.memberCollection, member._id)
    setDoc(ref, member)
  }

  public async addMember(member: Member) {
    addDoc(this.memberCollection, member)
  }
}
