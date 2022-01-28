import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { AppContextProvider } from "./AppContext";
import AboutPage from "./Components/Pages/AboutPage";
import HomePage from "./Components/Pages/HomePage";
import Instructions from "./Components/Pages/Instructions";
import TestChat from "./Components/Pages/TestChat";
import HostPage from "./PhaserPages/HostPage";
import PlayerPage from "./PhaserPages/PlayerPage";
import socket from "./SocketConnection";

export default function App() {
  window.onunload = (event) => {
    const e = event || window.event;
    e.preventDefault();
    socket.close();
    return "";
  };

  return (
    <AppContextProvider>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/fixedRoomId/:fixedRoomId" element={<HomePage />} />
            <Route path="/instructions" element={<Instructions />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/testchat" element={<TestChat />} />
            <Route path="/testchat/:roomId" element={<TestChat />} />
            <Route path="/room/:roomId" element={<PlayerPage />} />
            <Route path="/host/:roomId/:game" element={<HostPage />} />
          </Routes>
        </BrowserRouter>
      </div>
    </AppContextProvider>
  );
}
