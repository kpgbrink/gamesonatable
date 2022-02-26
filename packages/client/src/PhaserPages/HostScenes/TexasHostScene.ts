import Phaser from "phaser";
import socket from "../../SocketConnection";

export default class TexasHostScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TexasHostScene' })
    }

    preload() {
        this.load.atlas('cards', 'assets/atlas/cards.png', 'assets/atlas/cards.json');
    }

    create() {
        socket.off();
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
