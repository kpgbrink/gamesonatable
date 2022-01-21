import React from "react";
import PhaserWrapper from "./PhaserWrapper";
import Phaser from "phaser";
import OmahaScene from "./PhaserGames/Omaha/OmahaScene";

export default function Omaha() {
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
