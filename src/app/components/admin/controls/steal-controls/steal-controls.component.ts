import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { StealsService } from '../../../../stores/steals.service';
import { ChooseCardComponent } from '../../../choose-card/choose-card.component';
import { PlayComponent } from '../../../play/play.component';
import { StealWaitingListComponent } from '../steal-waiting-list/steal-waiting-list.component';

@Component({
  selector: 'app-steal-controls',
  standalone: true,
  imports: [CommonModule, StealWaitingListComponent, ChooseCardComponent, PlayComponent],
  templateUrl: './steal-controls.component.html',
  styleUrl: './steal-controls.component.scss'
})
export class StealControlsComponent implements OnDestroy {

  private substriptions: Subscription[] = []
  constructor(public sSteal: StealsService) {

  }

  ngOnDestroy(): void {
    this.substriptions.forEach(sub => sub.unsubscribe())
  }
}
