import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppContextProvider } from "./AppContext";
import HomePage from "./Components/Pages/HomePage";
import HomePageCreatingRoomId from "./Components/Pages/HomePageCreatingRoomId";
import HostPage from "./PhaserPages/HostPage";
import PlayerPage from "./PhaserPages/PlayerPage";
import PlayerPageCreatingUserId from "./PhaserPages/PlayerPageCreatingUserId";

export default function App() {
  return (
    <AppContextProvider>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePageCreatingRoomId />} />
            <Route path="/room/:roomId" element={<HomePage />} />

            <Route
              path="/room/:roomId/player"
              element={<PlayerPageCreatingUserId />}
            />
            <Route
              path="/room/:roomId/player/:userId"
              element={<PlayerPage />}
            />

            <Route path="/host/:roomId/:game" element={<HostPage />} />
          </Routes>
        </BrowserRouter>
      </div>
    </AppContextProvider>
  );
}
