import { Timestamp } from "@angular/fire/firestore";
import { Member } from "./members.model";
import { Question } from "./question.model";
import { RoundAnswer } from "./round-result.model";

export interface Round{
    _id?: string;
    question: Question;
    startedAt?: Timestamp;
    endedAt?: Timestamp;
    results: RoundAnswer[];
    members: Member[];
    status: 'pending' | 'running' | 'finished';
}
