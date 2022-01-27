import { useEffect } from "react";
import Phaser from "phaser";
import { useParams } from "react-router-dom";
import PlayerStartingScene from "./PlayerScenes/PlayerStartingScene";
import PhaserWrapper from "./tools/PhaserWrapper";
import socket from "../SocketConnection";

export default function HostPage() {
  const { game } = useParams();

  useEffect(() => {
    socket.emit("select game", game);
    console.log("host select game ", game);
  }, [game]);

  return (
    <PhaserWrapper
      config={{
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
      gameName="Omaha"
    />
  );
}
