import { Injectable } from '@angular/core';
import { Auth, UserCredential, signInAnonymously } from '@angular/fire/auth';
import { BehaviorSubject, combineLatest } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private _signedIn$ = new BehaviorSubject(false);
  private _error$ = new BehaviorSubject('');
  private _loadingState$ = new BehaviorSubject(false)

  public signedIn$ = this._signedIn$.asObservable();
  public error$ = this._error$.asObservable();
  public loadingState$ = this._loadingState$.asObservable();

  private credential: UserCredential | undefined;

  public state$ = combineLatest(
    [this._signedIn$, this._error$, this._loadingState$],
    (signedIn, error, loadingState) => ({ signedIn, error, loadingState }))

  constructor(private auth: Auth) { }

  public async signin() {
    try {
      this._loadingState$.next(true)
      this._error$.next('')
      this.credential = await signInAnonymously(this.auth)
      this._loadingState$.next(false)
      this._signedIn$.next(true)
      return true

    } catch (err: any) {
      this._loadingState$.next(false)
      this._error$.next(err.message)
      this._signedIn$.next(false)
      return false
    }

  }
}
