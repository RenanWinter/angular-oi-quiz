import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Member } from '../../../models/members.model';
import { MembersService } from '../../../stores/members.service';
import { ModalService } from './../../../services/modal.service';
import { MemberFormComponent } from './member-form/member-form.component';

@Component({
  selector: 'app-members',
  standalone: true,
  imports: [CommonModule, MemberFormComponent],
  templateUrl: './members.component.html',
})
export class MembersComponent {
  action: 'edit' | 'create' = 'create'
  member: Member | undefined

  constructor(
    public membersService: MembersService,
    private modal: ModalService

  ) {
  }

  editMember(member: Member) {
    this.action = 'edit';
    this.member = member;
  }
  deleteMember(member: Member) {
    this.modal.show({
      title: 'Atençaõ!',
      content: `Deseja realmente excluir o participante ${member.name}?`,
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
            this.membersService.deleteMember(member)
            this.modal.close()
          }
        },
      ]

    })

  }
  createMember() {
    this.action = 'create';
    this.member = {
      name: '',
      isAdmin: false,
      code: '',
      photo_url: '',
    };
  }
}
