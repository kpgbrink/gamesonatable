import Phaser from "phaser";
import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../AppContext";
import HostBeforeGameStart from "./HostScenes/HostBeforeGameStart";
import OmahaHostScene from "./HostScenes/OmahaHostScene";
import TexasHostScene from "./HostScenes/TexasHostScene";
import PhaserWrapper from "./tools/PhaserWrapper";

export default function HostPage() {
  const { socket } = useContext(AppContext);
  const { roomId, game } = useParams();

  useEffect(() => {
    socket.emit("host room", roomId);
    socket.emit("select game", game);
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
        width: window.innerWidth,
        height: window.innerHeight,
        scene: [HostBeforeGameStart, OmahaHostScene, TexasHostScene],
        physics: {
          default: "arcade",
          arcade: {
            gravity: { y: 300 },
            debug: true,
          },
        },
        pixelArt: true,
      }}
      gameName="Host"
    />
  );
}
