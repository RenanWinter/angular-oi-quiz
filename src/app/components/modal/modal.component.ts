import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Modal, ModalAction } from '../../models/modal.model';
import { ModalService } from './../../services/modal.service';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
})
export class ModalComponent {
  @ViewChild('modalRef') modalRef!: ElementRef<HTMLDialogElement>

  modal: Modal | undefined

  constructor(public modalService: ModalService) {
    this.listenModal()
  }

  listenModal() {
    this.modalService.modal$.subscribe((modal) => {
      this.modal = modal
      this.show()
    })

    this.modalService.close$.subscribe(() => {
      this.close()
      this.modal = undefined
    })
  }

  executeAction(action: ModalAction) {
    if (action.closeOnClick !== false){
      this.close()
    }
    action.handler()
  }
  show() {
    this.modalRef.nativeElement.showModal()
  }

  close() {
    this.modalRef?.nativeElement?.close()
  }

}
