import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Present } from '../../models/present.model';

@Component({
  selector: 'app-present-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './present-card.component.html',
  styleUrl: './present-card.component.scss'
})
export class PresentCardComponent{
  @Input() present!: Present;
  @Input() flipped: boolean = false;
  @Input() revealed: boolean = false;
  @Input() number!: number;
  @Output() selected = new EventEmitter()
}
