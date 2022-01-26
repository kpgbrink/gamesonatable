import React from "react";
import { useEffect } from "react";
import Phaser from "phaser";

type PhaserWrapperProps = {
  config: Phaser.Types.Core.GameConfig;
  gameName: string;
};

export default function PhaserWrapper({ config }: PhaserWrapperProps) {
  const domId = `game`;

  useEffect(() => {
    const game = new Phaser.Game({
      ...config,
      parent: domId,
    });
    return () => {
      game.destroy(true);
    };
  }, [config, domId]);

  return <div id={domId}></div>;
}
