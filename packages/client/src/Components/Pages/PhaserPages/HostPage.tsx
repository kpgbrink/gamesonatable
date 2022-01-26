import React, { useEffect } from "react";
import Phaser from "phaser";
import { useParams } from "react-router-dom";
import socket from "../../../SocketConnection";
import PhaserWrapper, { phaserDomId } from "./tools/PhaserWrapper";
import PlayerStartingScene from "./PlayerScenes/PlayerStartingScene";
import { usePhaser } from "./usePhaser";

export default function HostPage() {
  const { roomId, game } = useParams();
  usePhaser({
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
    parent: phaserDomId,
  });

  useEffect(() => {
    socket.emit("select game", game);
  }, [game]);

  return <PhaserWrapper />;
}
