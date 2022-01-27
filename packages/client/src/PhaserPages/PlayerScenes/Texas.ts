import Phaser from "phaser";
import FpsText from "../tools/objects/fpsText";
import PhaserLogo from "../tools/objects/phaserLogo";
import { onChangeGames } from "../tools/OnChangeGames";


export default class Texas extends Phaser.Scene {
    fpsText: FpsText | undefined

    constructor() {
        super({ key: 'Texas' })
    }

    create() {
        onChangeGames(this.scene);

        new PhaserLogo(this, this.cameras.main.width / 3, 0)
        this.fpsText = new FpsText(this)


        // display the Phaser.VERSION
        this.add
            .text(this.cameras.main.width - 15, 15, `Phaser v${Phaser.VERSION}`, {
                color: 'red',
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
}
