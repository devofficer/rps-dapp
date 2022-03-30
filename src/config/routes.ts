import CreatedGame from "components/pages/CreatedGame";
import GameBoard from "components/pages/GameBoard";
import JoinedGame from "components/pages/JoinedGame";
import JoinGame from "components/pages/JoinGame";

const ROUTES = {
  home: {
    path: '/',
    component: GameBoard,
  },
  join: {
    path: '/join/:addr',
    component: JoinGame,
  },
  created: {
    path: '/created-game/:addr/:timestamp',
    component: CreatedGame,
  },
  joined: {
    path: '/joined-game/:addr',
    component: JoinedGame,
  },
};

export default ROUTES;