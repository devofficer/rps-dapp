export enum Move {
  Null, Rock, Paper, Scissors, Spock, Lizard
};

export const RPS_MOVEMENTS = [
  { move: Move.Rock, name: 'Rock' },
  { move: Move.Paper, name: 'Paper' },
  { move: Move.Scissors, name: 'Scissors' },
  { move: Move.Spock, name: 'Spock' },
  { move: Move.Lizard, name: 'Lizard' },
];

export enum GameOverStatus {
  Null, Refunded, Winned, Defeated, Timeouted, Failed
};

export const GAME_OVER_MESSAGES = {
  [GameOverStatus.Refunded]: 'You are refunded',
  [GameOverStatus.Winned]: 'Congratulations... you are winner!',
  [GameOverStatus.Defeated]: 'Sorry... you are defeated!',
  [GameOverStatus.Timeouted]: 'Oops... your player is not available!',
  [GameOverStatus.Failed]: 'Oops...invalid parameters are detected!',
};
