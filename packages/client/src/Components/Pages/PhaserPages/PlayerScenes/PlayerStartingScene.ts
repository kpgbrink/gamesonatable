import Phaser from "phaser";
import socket from "../../../../SocketConnection";
import FpsText from "../tools/objects/fpsText";
import PhaserLogo from "../tools/objects/phaserLogo";


export default class PlayerStartingScene extends Phaser.Scene {
  fpsText: FpsText | undefined

  constructor() {
    super({ key: 'PlayerStartingScene' })
  }

  create() {
    socket.on("select game", (game) => {
      console.log("game selected", game);
      this.scene.start(game);
    });

    new PhaserLogo(this, this.cameras.main.width / 2, 0)
    this.fpsText = new FpsText(this)

    // display the Phaser.VERSION
    this.add
      .text(this.cameras.main.width - 15, 15, `Phaser v${Phaser.VERSION}`, {
        color: '#000000',
        fontSize: '24px'
      })
      .setOrigin(1, 0)
  }

  updateFpsText() {
    if (!this.fpsText) return;
    this.fpsText.update()
  }

  update() {
    this.updateFpsText();
  }

  unload() {
    socket.off("select game");
  }
}