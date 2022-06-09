import Phaser from "phaser";
import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../AppContext";
import PhaserWrapper from "./PhaserWrapper";
import Omaha from "./PlayerScenes/Omaha";
import PlayerBeforeGameStart from "./PlayerScenes/PlayerBeforeGameStart";
import PlayerStartingScene from "./PlayerScenes/PlayerStartingScene";
import Texas from "./PlayerScenes/Texas";
import ThirtyOne from "./PlayerScenes/ThirtyOne";

export default function PlayerPage() {
  const { socket } = useContext(AppContext);
  const { roomId, userId } = useParams();

  useEffect(() => {
    socket.emit("join room", roomId, userId);
    return () => {
      socket.off();
    };
  }, [roomId, socket, userId]);

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
          PlayerStartingScene,
          PlayerBeforeGameStart,
          Omaha,
          Texas,
          ThirtyOne,
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
          width: 1920,
          height: 1080,
          fullscreenTarget: "game",
        },
      }}
      gameName="Client"
    />
  );
}
