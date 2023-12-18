import { Timestamp } from "@angular/fire/firestore";
import { Member } from "./members.model";

export interface RoundAnswer{
  _id?: string;
  member: Member;
  startedAt: Timestamp;
  endedAt?: Timestamp;
  secondsToAnswer?: number;
  points?: number;
  answer?: string;
  answeredCorrectly?: boolean;
  position?: number;
}
