import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Member } from '../../../../models/members.model';
import { MembersService } from '../../../../stores/members.service';

@Component({
  selector: 'app-member-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './member-form.component.html'
})
export class MemberFormComponent implements OnInit {
  @Input() member!: Member
  @Input() action: 'edit' | 'create' = 'create'

  @Output() onClose = new EventEmitter<void>()

  title = ''

  model: Member = {
    name: '',
    isAdmin: false,
    code: '',
    photo_url: '',
  }

  constructor(private memberService: MembersService){}


  ngOnInit() {
    this.title = this.action === 'create' ? 'Novo participante' : 'Editar participante'
    if (this.action === 'edit') {
      this.model = { ...this.member }
    }
  }

  save(){
    const update = {
      ...this.member,
      ...this.model
    }

    if (this.action === 'create') {
      this.memberService.addMember(update)
    } else if (this.action === 'edit') {
      this.memberService.editMember(update)
    }

    this.onClose.emit()
  }

  cancel(){
    this.onClose.emit()
  }

}
