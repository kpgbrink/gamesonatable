import React from "react";
import Phaser from "phaser";
import PhaserWrapper from "./Games/PhaserWrapper";
import OmahaScene from "./Games/PhaserGames/Omaha/OmahaScene";

export default function HostPage() {
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
