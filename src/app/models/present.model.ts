import { Member } from "./members.model";


export interface Present {
  _id?: string;
  name: string;
  img:string;
  member?: Member;
}
