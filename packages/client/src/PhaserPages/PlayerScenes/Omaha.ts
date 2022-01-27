import Phaser from "phaser";
import FpsText from "../tools/objects/fpsText";
import PhaserLogo from "../tools/objects/phaserLogo";
import { onChangeGames } from "../tools/OnChangeGames";


export default class Omaha extends Phaser.Scene {
  fpsText: FpsText | undefined

  constructor() {
    super({ key: 'Omaha' })
  }

  create() {
    onChangeGames(this.scene);
    // socket.off();
    // socket.on("select game", (game) => {
    //   console.log("game selected", game);
    //   this.scene.start(game);
    // });

    new PhaserLogo(this, this.cameras.main.width / 4, 0)
    this.fpsText = new FpsText(this)

    // display the Phaser.VERSION
    this.add
      .text(this.cameras.main.width - 15, 15, `Phaser v${Phaser.VERSION}`, {
        color: 'blue',
        fontSize: '24px'
      })
      .setOrigin(1, 0)
  }

  updateFpsText() {
    if (!this.fpsText) return;
  }

  update() {
    this.updateFpsText();
  }
}
