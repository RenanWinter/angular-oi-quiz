import { Game } from './game.model';
import { Member } from './members.model';


export interface StealGame extends Game {
  members: Member[],
  nextMember: Member,

}
