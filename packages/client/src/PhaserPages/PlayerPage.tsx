import Phaser from "phaser";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import socket from "../SocketConnection";
import BeforeGameStart from "./PlayerScenes/BeforeGameStart";
import Omaha from "./PlayerScenes/Omaha";
import PlayerStartingScene from "./PlayerScenes/PlayerStartingScene";
import Texas from "./PlayerScenes/Texas";
import PhaserWrapper from "./tools/PhaserWrapper";

export default function PlayerPage() {
  const { roomId } = useParams();

  useEffect(() => {
    socket.emit("join room", roomId);
  }, [roomId]);

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
        scene: [PlayerStartingScene, BeforeGameStart, Omaha, Texas],
        physics: {
          default: "arcade",
          arcade: {
            gravity: { y: 300 },
            debug: true,
          },
        },
        pixelArt: true,
      }}
      gameName="Client"
    />
  );
}
