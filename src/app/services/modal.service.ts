import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Modal } from '../models/modal.model';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  private _modal$ = new Subject<Modal>();
  public modal$ = this._modal$.asObservable();

  private _close$ = new BehaviorSubject(0);
  public close$ = this._close$.asObservable();

  public show(modal: Modal) {
    this._modal$.next(modal)
  }

  public close() {
    this._close$.next(this._close$.getValue() + 1)
  }
}
