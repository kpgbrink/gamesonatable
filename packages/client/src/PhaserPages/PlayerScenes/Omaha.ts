import Phaser from "phaser";
import { onChangeGames } from "../tools/OnChangeGames";


export default class Omaha extends Phaser.Scene {
  constructor() {
    super({ key: 'Omaha' })
  }

  create() {
    onChangeGames(this.scene);

    // display the Phaser.VERSION
    this.add
      .text(this.cameras.main.width - 15, 15, `Phaser v${Phaser.VERSION}`, {
        color: 'blue',
        fontSize: '24px'
      })
      .setOrigin(1, 0)
  }

  updateFpsText() {
  }

  update() {
    this.updateFpsText();
  }
}
