import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { AppContextProvider } from "./AppContext";
import AboutPage from "./Components/Pages/AboutPage";
import HomePage from "./Components/Pages/HomePage";
import HomePageCreatingRoomId from "./Components/Pages/HomePageCreatingRoomId";
import Instructions from "./Components/Pages/Instructions";
import HostPage from "./PhaserPages/HostPage";
import PlayerPage from "./PhaserPages/PlayerPage";
import PlayerPageCreatingUserId from "./PhaserPages/PlayerPageCreatingUserId";

export default function App() {
  // window.onunload = (event) => {
  //   const e = event || window.event;
  //   e.preventDefault();
  //   socket.close();
  //   return "";
  // };

  return (
    <AppContextProvider>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePageCreatingRoomId />} />
            <Route path="/room/:roomId" element={<HomePage />} />

            <Route path="/instructions" element={<Instructions />} />
            <Route path="/about" element={<AboutPage />} />

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
