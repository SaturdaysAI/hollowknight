import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./features/wiki/pages/Home";
import WikiIndex from "./features/wiki/pages/WikiIndex";
import BossesPage from "./features/wiki/pages/BossesPage";
import WarriorDreamsPage from "./features/wiki/pages/WarriorDreamsPage";
import VariantsPage from "./features/wiki/pages/VariantsPage";
import CharmsPage from "./features/wiki/pages/CharmsPage";
import ItemsPage from "./features/wiki/pages/ItemsPage";
import WikiDetail from "./features/wiki/pages/WikiDetail";
import TriviaStart from "./features/trivia/pages/TriviaStart";
import TriviaResults from "./features/trivia/pages/TriviaResults";
import NotFound from "./features/wiki/pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Wiki */}
        <Route path="/wiki" element={<WikiIndex />} />
        <Route path="/wiki/bosses" element={<BossesPage />} />
        <Route path="/wiki/warrior-dreams" element={<WarriorDreamsPage />} />
        <Route path="/wiki/variants" element={<VariantsPage />} />
        <Route path="/wiki/charms" element={<CharmsPage />} />
        <Route path="/wiki/items" element={<ItemsPage />} />
        <Route path="/wiki/:group/:slug" element={<WikiDetail />} />

        {/* Trivia (todo el juego en /trivia) */}
        <Route path="/trivia" element={<TriviaStart />} />
        <Route path="/trivia/results" element={<TriviaResults />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
