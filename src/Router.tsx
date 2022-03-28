import { BrowserRouter, Routes, Route } from "react-router-dom";
import GameBoard from 'components/pages/GameBoard';

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GameBoard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;