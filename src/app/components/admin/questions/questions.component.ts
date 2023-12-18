import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Question } from '../../../models/question.model';
import { ModalService } from '../../../services/modal.service';
import { QuestionService } from '../../../stores/question.service';
import { QuestionFormComponent } from './question-form/question-form.component';

@Component({
  selector: 'app-questions',
  standalone: true,
  imports: [CommonModule, QuestionFormComponent],
  templateUrl: './questions.component.html',
})
export class QuestionsComponent {

  action: 'edit' | 'create' = 'create'
  item: Question | undefined

  constructor(
    public service: QuestionService,
    private modal: ModalService
  ) {
  }

  edit(item: Question) {
    this.action = 'edit';
    this.item = item;
  }
  remove(item: Question) {
    this.modal.show({
      title: 'Atençaõ!',
      content: `Deseja realmente excluir esta pergunta? <br><br> ${item.question}`,
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
            this.service.delete(item)
            this.modal.close()
          }
        },
      ]

    })

  }
  create() {
    this.action = 'create';
    this.item = {
      answer: '',
      options: [],
      question: '',
      order: 0,
      points: 1000
    };
  }

}
