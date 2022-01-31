import Phaser from "phaser";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import socket from "../SocketConnection";
import PlayerStartingScene from "./PlayerScenes/PlayerStartingScene";
import PhaserWrapper from "./tools/PhaserWrapper";

export default function HostPage() {
  const { game } = useParams();

  useEffect(() => {
    socket.emit("select game", game);
    console.log("host select game ", game);
  }, [game]);

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
        scene: [PlayerStartingScene],
        physics: {
          default: "arcade",
          arcade: {
            gravity: { y: 300 },
            debug: false,
          },
        },
      }}
      gameName="Host"
    />
  );
}
