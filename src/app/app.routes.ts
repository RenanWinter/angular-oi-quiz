import { Routes } from '@angular/router';
import { AdminComponent } from './components/admin/admin.component';
import { PlayComponent } from './components/play/play.component';
import { SigninComponent } from './components/signin/signin.component';

export const routes: Routes = [
  { path: '', title: 'OI Quiz', component: SigninComponent },
  { path: 'play', title: 'OI Quiz', component: PlayComponent },
  { path: 'admin', title: 'OI Quiz', component: AdminComponent }
];
