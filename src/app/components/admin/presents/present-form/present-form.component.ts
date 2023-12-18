import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Present } from '../../../../models/present.model';
import { PresentsService } from '../../../../stores/presents.service';

@Component({
  selector: 'app-present-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './present-form.component.html',
  styleUrl: './present-form.component.scss'
})
export class PresentFormComponent implements OnInit {

  @Input() present!: Present
  @Input() action: 'edit' | 'create' = 'create'

  @Output() onClose = new EventEmitter<void>()

  title = ''

  model: Present = {
    name: '',
    img:''
  }

  constructor(private sPresent: PresentsService){}

  ngOnInit() {
    this.title = this.action === 'create' ? 'Novo presente' : 'Editar presente'
    if (this.action === 'edit') {
      this.model = { ...this.present }
    }
  }

  save(){
    const update = {
      ...this.present,
      ...this.model
    }

    if (this.action === 'create') {
      this.sPresent.addPresent(update)
    } else if (this.action === 'edit') {
      this.sPresent.editPresent(update)
    }

    this.onClose.emit()
  }

  cancel(){
    this.onClose.emit()
  }

}
