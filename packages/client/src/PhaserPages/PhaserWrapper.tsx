import Phaser from "phaser";
import { useEffect } from "react";

type PhaserWrapperProps = {
  config: Phaser.Types.Core.GameConfig;
};

// add sizeChanged and game to window interface
// declare global {
//   interface Window {
//     sizeChanged: () => void;
//     game: Phaser.Game;
//   }
// }

export default function PhaserWrapper({ config }: PhaserWrapperProps) {
  const domId = `game`;

  // trigger resize event after window is loaded
  // useEffect(() => {
  //   // after one second triggerr
  //   setTimeout(() => {
  //     window.dispatchEvent(new Event("resize"));
  //   }, 1000);
  // }, []);

  const configWithDom = {
    parent: domId,
    loader: {
      baseURL: "/",
    },
    dom: {
      createContainer: true,
    },
    type: Phaser.AUTO,
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 300 },
        debug: true,
      },
    },
    ...config,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 1920 * 2,
      height: 1080 * 2,
      fullscreenTarget: "game",
      ...config.scale,
    },
  };

  console.log("configWithDom", configWithDom);

  // create phaser game
  useEffect(() => {
    const game = new Phaser.Game(configWithDom);
    return () => {
      game.destroy(true);
    };
  });

  // show phaser game
  return (
    <div>
      <div id={domId} />;
    </div>
  );
}
