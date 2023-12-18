
export interface Question {
  _id?: string;
  question: string;
  answer: string;
  options: string[];
  order: number;
  points: number;
}
