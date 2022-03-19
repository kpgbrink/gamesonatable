import Phaser from "phaser";
import React, { useEffect } from "react";

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
      // callbacks: {
      //   postBoot: () => {
      //     window.game = game;
      //     window.sizeChanged();
      //   },
      // },
    });
    return () => {
      game.destroy(true);
    };
  }, [config, domId]);

  return <div id={domId} style={{ maxHeight: 100 }}></div>;
}

// window.sizeChanged = () => {
//   if (window.game.isBooted) {
//     setTimeout(() => {
//       window.game.scale.resize(window.innerWidth, window.innerHeight);
//       window.game.canvas.setAttribute(
//         "style",
//         `display: width: ${window.innerWidth}px; height: ${window.innerHeight}px;`
//       );
//     }, 100);
//   }
// };

// window.onresize = () => window.sizeChanged();
