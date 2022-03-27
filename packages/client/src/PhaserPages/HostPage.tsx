import Phaser from "phaser";
import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../AppContext";
import HostBeforeGameStart from "./HostScenes/HostBeforeGameStart";
import OmahaHostScene from "./HostScenes/OmahaHostScene";
import TexasHostScene from "./HostScenes/TexasHostScene";
import ThirtyOneHostScene from "./HostScenes/ThirtyOneHostScene";
import PhaserWrapper from "./tools/PhaserWrapper";

export default function HostPage() {
  const { socket } = useContext(AppContext);
  const { roomId, game } = useParams();

  useEffect(() => {
    socket.emit("host room", roomId);
    socket.emit("select game", game);
    return () => {
      socket.off();
    };
  }, [game, roomId, socket]);

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
