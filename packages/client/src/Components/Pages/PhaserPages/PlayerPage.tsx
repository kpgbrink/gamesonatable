import React, { useEffect } from "react";
import Phaser from "phaser";
import { useParams } from "react-router-dom";
import socket from "../../../SocketConnection";
import PhaserWrapper from "./tools/PhaserWrapper";
import PlayerStartingScene from "./PlayerScenes/PlayerStartingScene";

export default function PlayerPage() {
  const { roomId } = useParams();

  useEffect(() => {
    console.log("joining room", roomId);
    socket.emit("join room", roomId);
  }, [roomId]);

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
