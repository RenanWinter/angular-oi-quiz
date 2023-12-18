import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { GameStatus } from '../../models/game.model';

@Component({
  selector: 'app-waiting-round',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './waiting-round.component.html',
  styleUrl: './waiting-round.component.scss'
})
export class WaitingRoundComponent {

  @Input() state!: GameStatus

}
