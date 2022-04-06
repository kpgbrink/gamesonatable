import Phaser from "phaser";
import PlayerScene from "./playerObjects/PlayerScene";


export default class Omaha extends PlayerScene {
  constructor() {
    super({ key: 'Omaha' });
  }

  create() {
    super.create();
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
