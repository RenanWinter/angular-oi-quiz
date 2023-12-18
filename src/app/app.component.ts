import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Auth, signInAnonymously } from '@angular/fire/auth';
import { DocumentData, Firestore, collection, collectionData } from '@angular/fire/firestore';
import { RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { ModalComponent } from './components/modal/modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ModalComponent,
    CommonModule
  ],
  template: `
  <router-outlet></router-outlet>
  <app-modal/>
  `,
  styles:[
    `
    :host {
      display: block;
      height: 100%;
      width: 100%;
    }
    `
  ]
})
export class AppComponent {
  members$: Observable<any>;
  signedIn = false
  private firestore: Firestore = inject(Firestore);
  private auth: Auth = inject(Auth);

  constructor() {
    const memberCollection = collection(this.firestore, 'members');
    this.members$ = collectionData<DocumentData>(memberCollection)
    this.signin()

  }

  signin() {
    signInAnonymously(this.auth).then(() => {
      this.signedIn = true;
    })
  }


}
