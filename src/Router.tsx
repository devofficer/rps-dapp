import { BrowserRouter, Routes, Route } from "react-router-dom";
import GameBoard from 'components/pages/GameBoard';
import CreatedGame from 'components/pages/CreatedGame';

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GameBoard />} />
        <Route path="/created-game/:addr" element={<CreatedGame />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;