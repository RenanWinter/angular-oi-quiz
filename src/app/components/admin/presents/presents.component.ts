import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Present } from '../../../models/present.model';
import { ModalService } from '../../../services/modal.service';
import { PresentsService } from '../../../stores/presents.service';
import { PresentFormComponent } from './present-form/present-form.component';

@Component({
  selector: 'app-presents',
  standalone: true,
  imports: [CommonModule, PresentFormComponent],
  templateUrl: './presents.component.html',
  styleUrl: './presents.component.scss'
})
export class PresentsComponent {

  public action: 'edit' | 'create' = 'create';
  public present: Present | undefined;

  constructor(
    public sPresents: PresentsService,
    private modal: ModalService
  ) {
  }

  editPresent(present: Present) {
    this.action = 'edit';
    this.present = present;
  }
  deletePresent(present: Present) {
    this.modal.show({
      title: 'Atençaõ!',
      content: `Deseja realmente excluir o presente ${present.name}?`,
      actions: [
        {
          color: 'primary',
          text: 'Não',
          handler: () => {
            this.modal.close()
          }
        },
        {
          color: 'error',
          text: 'Sim',
          handler: () => {
            this.sPresents.deletePresent(present)
            this.modal.close()
          }
        },
      ]

    })

  }
  createPresent() {
    this.action = 'create';
    this.present = {
      name: '',
      img:''
    };
  }

}
