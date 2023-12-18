

export interface Modal{
  title: string;
  content: string;
  actions: ModalAction[];
}

export interface ModalAction{
  text: string;
  color: string;
  closeOnClick?: boolean;
  handler: ()=>void;
}
