import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./Components/Pages/HomePage";
import AboutPage from "./Components/Pages/AboutPage";
import Instructions from "./Components/Pages/Instructions";
import Texas from "./Components/Pages/Games/Texas";
import Omaha from "./Components/Pages/Games/Omaha";
import TestChat from "./Components/Pages/TestChat";
import { AppContextProvider } from "./AppContext";

export default function App() {
  return (
    <AppContextProvider>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/room/:roomId" element={<HomePage />} />
            <Route path="/instructions" element={<Instructions />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/games/texas/:roomId" element={<Texas />} />
            <Route path="/games/omaha/:roomId" element={<Omaha />} />
            <Route path="/testchat" element={<TestChat />} />
            <Route path="/testchat/:roomId" element={<TestChat />} />
          </Routes>
        </BrowserRouter>
      </div>
    </AppContextProvider>
  );
}
