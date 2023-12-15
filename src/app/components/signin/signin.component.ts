import { Component } from '@angular/core';
import { LogoComponent } from '../icons/logo/logo.component';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [LogoComponent],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss'
})
export class SigninComponent {

}
