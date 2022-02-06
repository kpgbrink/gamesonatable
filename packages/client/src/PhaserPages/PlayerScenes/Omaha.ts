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

    const screenX = this.cameras.main.worldView.x + this.cameras.main.width;
    const screenY = this.cameras.main.worldView.y + this.cameras.main.height;

    const playerCloak = this.add.image(screenX / 2, screenY / 2, 'cloak');
    const playerBase = this.add.image(screenX / 2, screenY / 2, 'base');
    const playerLegs = this.add.image(screenX / 2, screenY / 2, 'legs');
    const playerBody = this.add.image(screenX / 2, screenY / 2, 'body');
    const playerGloves = this.add.image(screenX / 2, screenY / 2, 'gloves');
    const playerBeard = this.add.image(screenX / 2, screenY / 2, 'beard');
    const playerBoots = this.add.image(screenX / 2, screenY / 2, 'boots');
    const playerHair = this.add.image(screenX / 2, screenY / 2, 'hair');
    const playerHead = this.add.image(screenX / 2, screenY / 2, 'head');

    playerBase.scale = 10;
    playerBeard.scale = 10;
    playerBoots.scale = 10;
    playerBody.scale = 10;
    playerHair.scale = 10;
    playerHead.scale = 10;
    playerLegs.scale = 10;
    playerCloak.scale = 10;
    playerGloves.scale = 10;
  }

  updateFpsText() {
  }

  update() {
    this.updateFpsText();
  }
}
