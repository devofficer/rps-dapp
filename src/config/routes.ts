import CreatedGame from "components/pages/CreatedGame";
import GameBoard from "components/pages/GameBoard";
import JoinedGame from "components/pages/JoinedGame";

const ROUTES = {
  home: {
    path: '/',
    component: GameBoard,
  },
  created: {
    path: '/created-game/:addr',
    component: CreatedGame,
  },
  joined: {
    path: '/joined-game/:addr',
    component: JoinedGame,
  },
};

export default ROUTES;