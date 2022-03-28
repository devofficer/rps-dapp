import CreatedGame from "components/pages/CreatedGame";
import GameBoard from "components/pages/GameBoard";

const ROUTES = {
  home: {
    path: '/',
    component: GameBoard,
  },
  created: {
    path: '/created-game/:addr',
    component: CreatedGame,
  },
};

export default ROUTES;