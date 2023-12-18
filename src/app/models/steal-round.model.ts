import { Member } from "./members.model";
import { Present } from "./present.model";

export interface StealRound{
  _id?:string;
  member: Member,
  present?: Present,
  picked?:Present
  stolenBy?: Member,
  status: 'pending' | 'choosing-card' | 'choosing-member' | 'finished' | 'terminated',
  order: number,
  isNext: boolean
}
