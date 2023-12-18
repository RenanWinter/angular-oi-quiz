import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MembersService } from '../../stores/members.service';
import { StealsService } from '../../stores/steals.service';

@Component({
  selector: 'app-steal-finished-round',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './steal-finished-round.component.html',
  styleUrl: './steal-finished-round.component.scss'
})
export class StealFinishedRoundComponent {

  public waiting: boolean = true

  constructor(public sSteal: StealsService, public sMember: MembersService){

    setTimeout(() => {
      this.waiting = false
    }, 1000);

  }
}
