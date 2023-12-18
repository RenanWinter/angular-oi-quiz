import { Member } from "./members.model";


export interface ScoreboardItem {
  position: number;
  member: string;
  memberRef: Member;
  rounds: string[];
  totalStr: string;
  totalInt: number;
}
