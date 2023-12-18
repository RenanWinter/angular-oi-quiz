
export type GameStatus = 'configuring' | 'waiting' | 'running' | 'stopped' | 'scoreboard' | 'finished';

export interface Game{
  _id?: string;
  state: GameStatus;
}
