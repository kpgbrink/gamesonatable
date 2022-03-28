import Phaser from "phaser";
import PlayerScene from "./tools/PlayerScene";


export default class Texas extends PlayerScene {
    constructor() {
        super({ key: 'Texas' });
    }

    create() {
        super.create();
        // display the Phaser.VERSION
        this.add
            .text(this.cameras.main.width - 15, 15, `Phaser v${Phaser.VERSION}`, {
                color: 'red',
                fontSize: '24px'
            })
            .setOrigin(1, 0);
    }

    update() {
    }
}
