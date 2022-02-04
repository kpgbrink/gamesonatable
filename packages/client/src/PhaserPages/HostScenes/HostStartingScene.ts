import Phaser from "phaser";

export default class HostStartingScene extends Phaser.Scene {
    constructor() {
        super({ key: 'HostStartingScene' })
    }

    create() {
        // display the Phaser.VERSION
        this.add
            .text(this.cameras.main.width - 15, 15, `Phaser v${Phaser.VERSION}`, {
                color: '#000000',
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
