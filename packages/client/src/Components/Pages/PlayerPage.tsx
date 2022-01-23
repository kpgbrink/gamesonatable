import React, { useEffect } from "react";
import Phaser from "phaser";
import PhaserWrapper from "./Games/PhaserWrapper";
import OmahaScene from "./Games/PhaserGames/Omaha/OmahaScene";
import { useParams } from "react-router-dom";
import socket from "../../SocketConnection";

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
        scene: [OmahaScene],
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
