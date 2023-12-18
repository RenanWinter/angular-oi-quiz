import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RoundAnswer } from '../../models/round-result.model';

@Component({
  selector: 'app-round-result',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './round-result.component.html',
  styleUrl: './round-result.component.scss'
})
export class RoundResultComponent {

  @Input() answer!: RoundAnswer
}
