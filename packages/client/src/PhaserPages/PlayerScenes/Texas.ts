import Phaser from "phaser";
import { onChangeGames } from "../tools/OnChangeGames";


export default class Texas extends Phaser.Scene {
    constructor() {
        super({ key: 'Texas' })
    }

    create() {
        onChangeGames(this.scene);

        // display the Phaser.VERSION
        this.add
            .text(this.cameras.main.width - 15, 15, `Phaser v${Phaser.VERSION}`, {
                color: 'red',
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
