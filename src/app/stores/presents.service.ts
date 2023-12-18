import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, setDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Present } from '../models/present.model';

@Injectable({
  providedIn: 'root'
})
export class PresentsService {
  private presentsCollection = collection(this.firestore, 'presents');

  public presents$ = collectionData(this.presentsCollection, { idField: '_id' }) as Observable<Present[]>;

  constructor(private firestore: Firestore) { }

  public async deletePresent(present: Present) {
    const ref = doc(this.presentsCollection, present._id)
    deleteDoc(ref)
  }

  public async editPresent(present: Present) {
    const ref = doc(this.presentsCollection, present._id)
    setDoc(ref, present)
  }

  public async addPresent(present: Present) {
    addDoc(this.presentsCollection, present)
  }
}
