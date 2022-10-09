import { IonPhaser } from "@ion-phaser/react";
import Phaser from "phaser";

type PhaserWrapperProps = {
  config: Phaser.Types.Core.GameConfig;
  gameName: string;
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

  return (
    <div id={domId}>
      <IonPhaser game={config} initialize={true}></IonPhaser>
    </div>
  );
}
