import CreatedGame from "components/containers/CreatedGame";
import CreateGame from "components/containers/CreateGame";
import JoinedGame from "components/containers/JoinedGame";
import JoinGame from "components/containers/JoinGame";

const ROUTES = {
  home: {
    path: '/',
    component: CreateGame,
  },
  join: {
    path: '/join/:addr',
    component: JoinGame,
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