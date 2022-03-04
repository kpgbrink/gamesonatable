import Phaser from "phaser";
import { onPlayerChangeGames } from "./OnPlayerChangeGames";


export default class PlayerScene extends Phaser.Scene {
    constructor(config: Phaser.Types.Scenes.SettingsConfig) {
        super(config);
    }

    create() {
        onPlayerChangeGames(this);
    }

    updateFpsText() {
    }

    update() {
        this.updateFpsText();
    }
}
