import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, setDoc } from '@angular/fire/firestore';
import { Observable, map, take } from 'rxjs';
import { Question } from '../models/question.model';


@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  private collectionRef = collection(this.firestore, 'questions');

  public questions$ = (collectionData(this.collectionRef, { idField: '_id' }) as Observable<Question[]>)
  .pipe(
    map((questions: Question[]) => {
      return questions.sort((a, b) => a.order - b.order)
    })
  );


  constructor(private firestore: Firestore) {}

  public async delete(item: Question){
    const ref = doc(this.collectionRef, item._id)
    deleteDoc(ref)
  }

  public async edit(item: Question) {
    const ref = doc(this.collectionRef, item._id)
    setDoc(ref, item)
  }

  public async crete(item: Question){
    this.questions$.pipe(take(1)).subscribe(questions =>{
      const last = questions[questions.length - 1]
      item.order = last ? last.order + 1 : 1
      addDoc(this.collectionRef, item )
    })
  }

  public moveUp(item: Question) {
    this.questions$.pipe(take(1)).subscribe(questions =>{
      const previous = questions.find(question => question.order === item.order - 1)
      if (!previous) return;
      this.edit({ ...item, order: item.order - 1 })
      this.edit({ ...previous, order: previous.order + 1 })
    })
  }

  public moveDown(item: Question) {
    this.questions$.pipe(take(1)).subscribe(questions =>{
      const next = questions.find(question => question.order === item.order + 1)
      if (!next) return;
      this.edit({ ...item, order: item.order + 1 })
      this.edit({ ...next, order: next.order - 1 })
    })
  }

}
