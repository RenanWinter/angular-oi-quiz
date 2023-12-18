import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [],
  templateUrl: './logo.component.html',
})
export class LogoComponent implements OnChanges{

  @Input() width: string = '149';
  height: number = 63;
  ratio: number = 149/ 63;

  ngOnChanges(): void {
    this.height = +this.width / this.ratio;

  }


}
