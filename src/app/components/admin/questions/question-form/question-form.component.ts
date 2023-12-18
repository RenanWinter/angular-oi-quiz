import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Question } from '../../../../models/question.model';
import { ModalService } from '../../../../services/modal.service';
import { QuestionService } from '../../../../stores/question.service';

@Component({
  selector: 'app-question-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './question-form.component.html'
})
export class QuestionFormComponent implements OnInit {
  @Input() item!: Question
  @Input() action: 'edit' | 'create' = 'create'

  @Output() onClose = new EventEmitter<void>()

  title = ''

  question = ''

  model: Question = {
    question: '',
    answer: '',
    options: [],
    order: 0,
    points: 1000
  }

  constructor(private service: QuestionService, private modal: ModalService){}


  ngOnInit() {
    this.title = this.action === 'create' ? 'Novo participante' : 'Editar participante'
    if (this.action === 'edit') {
      this.model = { ...this.item }
    }
  }

  save(){
    const update = {
      ...this.item,
      ...this.model
    }

    if (update.options.length < 2) {
      this.modal.show({
        title: 'Atenção!',
        content: 'É necessário ter pelo menos duas opções',
        actions: [
          {
            color: 'primary',
            text: 'Ok',
            handler: () => {
              this.modal.close()
            }
          },
        ]
      })
      return
    }

    if (update.answer === '') {
      this.modal.show({
        title: 'Atenção!',
        content: 'É necessário ter uma resposta.',
        actions: [
          {
            color: 'primary',
            text: 'Ok',
            handler: () => {
              this.modal.close()
            }
          },
        ]
      })
      return
    }

    if (this.action === 'create') {
      this.service.crete(update)
    } else if (this.action === 'edit') {
      this.service.edit(update)
    }

    this.onClose.emit()
  }

  cancel(){
    this.onClose.emit()
  }

  removeOption(option: string){
    this.model.options = this.model.options.filter(item => item !== option)
    if (this.model.answer === option) {
      this.model.answer = ''
    }
  }

  addOption(option: string){
    if (option === '' || this.model.options.includes(option)) {
      return
    }

    this.model.options.push(option)
    this.question = ''
  }

}
