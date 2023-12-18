import { Routes } from '@angular/router';
import { AdminComponent } from './components/admin/admin.component';
import { ControlsComponent } from './components/admin/controls/controls.component';
import { MembersComponent } from './components/admin/members/members.component';
import { PresentsComponent } from './components/admin/presents/presents.component';
import { QuestionsComponent } from './components/admin/questions/questions.component';
import { PlayComponent } from './components/play/play.component';
import { SigninComponent } from './components/signin/signin.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', title: 'OI Quiz', component: SigninComponent },
  { path: 'play', title: 'OI Quiz', component: PlayComponent, canActivate: [authGuard] },
  { path: 'admin', title: 'OI Quiz', component: AdminComponent, canActivate: [authGuard], children:[
    { path: 'members', title: 'OI Quiz | Membros', component: MembersComponent },
    { path: 'questions', title: 'OI Quiz | Quiz', component: QuestionsComponent },
    { path: 'presents', title: 'OI Quiz | Quiz', component: PresentsComponent },
    { path: 'controls', title: 'OI Quiz | Operações', component: ControlsComponent },

  ] }
];
