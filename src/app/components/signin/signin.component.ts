import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service.service';
import { MembersService } from '../../stores/members.service';
import { LogoComponent } from '../icons/logo/logo.component';
import { ModalService } from './../../services/modal.service';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [CommonModule, LogoComponent, FormsModule],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss'
})
export class SigninComponent {
  codigo = ''

  constructor(
    public authService: AuthService,
    private memberService: MembersService,
    private ModalService: ModalService,
    private router: Router
  ) {
    this.authService.signin()
  }

  async checkuser() {
    try {
      const member = await this.memberService.loadMember(this.codigo)
      sessionStorage.setItem('member', this.codigo)
      this.router.navigate(member.isAdmin ? ['admin', 'members'] : ['play'] )

    } catch (err: any) {
      this.ModalService.show({
        title: 'Ops!!!',
        content: err.message,
        actions: [
          {
            color: 'priumary',
            text: 'Ok',
            handler: () => {
              this.ModalService.close()
            }
          }
        ]
      })

    }
  }

}
