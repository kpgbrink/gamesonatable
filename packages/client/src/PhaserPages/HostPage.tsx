import { Game, GameData } from "api";
import Phaser from "phaser";
import { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../AppContext";
import HostBeforeGameStart from "./HostScenes/HostBeforeGameStart";
import OmahaHostScene from "./HostScenes/OmahaHostScene";
import TexasHostScene from "./HostScenes/TexasHostScene";
import ThirtyOneHostScene from "./HostScenes/ThirtyOneHostScene";
import PhaserWrapper from "./PhaserWrapper";

// Dictionary of game names to game scenes
const gameScenes: Map<string, GameData> = new Map([
  [
    "Omaha",
    {
      leavable: false,
      joinable: false,
    },
  ],
  [
    "Texas",
    {
      leavable: false,
      joinable: false,
    },
  ],
  [
    "ThirtyOne",
    {
      leavable: false,
      joinable: false,
    },
  ],
]);

export default function HostPage() {
  const { socket } = useContext(AppContext);
  const { roomId, game } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    socket.emit("host room", roomId);
    // Get Game Data for the game
    if (!game) {
      throw new Error("game is not defined in the URL");
    }
    const gameData = gameScenes.get(game);
    const updateGame: Partial<Game> = {
      // Spread gameData into updateGame
      ...gameData,
      selectedGame: game,
    };
    socket.emit("update game", updateGame);
    // add listener to allow phaser code to change url
    window.addEventListener(
      "changeroute",
      (e: any) => {
        console.log("change url", e.detail);
        const { detail: path } = e;
        navigate(path);
      },
      true
    );
    return () => {
      socket.off();
      // remove event listener
      window.removeEventListener("changeroute", () => {});
    };
  }, [game, roomId, socket, navigate]);

  return (
    <PhaserWrapper
      config={{
        loader: {
          baseURL: "/",
        },
        dom: {
          createContainer: true,
        },
        type: Phaser.AUTO,
        scene: [
          HostBeforeGameStart,
          OmahaHostScene,
          TexasHostScene,
          ThirtyOneHostScene,
        ],
        physics: {
          default: "arcade",
          arcade: {
            gravity: { y: 300 },
            debug: true,
          },
        },
        pixelArt: true,
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH,
          width: 1920 * 2,
          height: 1080 * 2,
          fullscreenTarget: "game",
        },
      }}
      gameName="Host"
    />
  );
}
