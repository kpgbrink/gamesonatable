import Phaser from "phaser";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import socket from "../../../SocketConnection";
import Omaha from "./PlayerScenes/Omaha";
import PlayerStartingScene from "./PlayerScenes/PlayerStartingScene";
import Texas from "./PlayerScenes/Texas";
import PhaserWrapper from "./tools/PhaserWrapper";
import { usePhaser } from "./usePhaser";

export default function PlayerPage() {
  const { roomId } = useParams();
  usePhaser({
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    scene: [PlayerStartingScene, Omaha, Texas],
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 300 },
        debug: false,
      },
    },
    parent: "game",
  });

  useEffect(() => {
    console.log("joining room", roomId);
    socket.emit("join room", roomId);
  }, [roomId]);

  return <PhaserWrapper />;
}
