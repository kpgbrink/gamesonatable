import React from "react";
import Phaser from "phaser";
import PhaserWrapper from "./tools/PhaserWrapper";
import { useParams } from "react-router-dom";
import OmahaHostScene from "./HostScenes/OmahaHostScene";

export default function HostPage() {
  const { roomId, game } = useParams();

  return (
    <PhaserWrapper
      config={{
        type: Phaser.AUTO,
        width: window.innerWidth,
        height: window.innerHeight,
        scene: [OmahaHostScene],
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
