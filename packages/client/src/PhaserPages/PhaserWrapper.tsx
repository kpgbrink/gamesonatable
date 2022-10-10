import { IonPhaser } from "@ion-phaser/react";
import Phaser from "phaser";

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

  return <IonPhaser game={configWithDom} id={domId} />;
}
