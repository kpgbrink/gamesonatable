import Phaser from "phaser";
import { useEffect } from "react";

type PhaserWrapperProps = {
  config: Phaser.Types.Core.GameConfig;
  gameName: string;
};

// add sizeChanged and game to window interface
declare global {
  interface Window {
    sizeChanged: () => void;
    game: Phaser.Game;
  }
}

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
