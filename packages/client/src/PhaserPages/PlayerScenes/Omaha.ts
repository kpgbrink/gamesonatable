import Phaser from "phaser";
import PlayerScene from "./tools/PlayerScene";


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

    var frames = this.textures.get('cards').getFrameNames();

    var x = 100;
    var y = 100;

    for (var i = 0; i < 10; i++) {
      var image = this.add.image(x, y, 'cards', Phaser.Math.RND.pick(frames)).setInteractive({ draggable: true });

      x += 4;
      y += 4;
    }
  }

  updateFpsText() {
  }

  update() {
    this.updateFpsText();
  }
}
