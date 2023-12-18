import { ModalAction } from "../../../models/modal.model";
import { RoundAnswer } from "../../../models/round-result.model";
import { Round } from "../../../models/round.model";

export type TableRecordStatus = 'fa fa-times' | 'fa fa-clock' | 'fa fa-clock spin' | 'fa fa-check'
export interface TableRecord{
  round: Round;
  answers: RoundAnswer[]
  question: string;
  points: number;
  status: TableRecordStatus
  answer: string;
  corrects: number;
  incorrects: number;
  actions: ModalAction[]
}
