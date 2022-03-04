import Phaser from "phaser";
import { onHostChangeGames } from "./OnHostChangeGames";


export default class HostScene extends Phaser.Scene {
    constructor(config: Phaser.Types.Scenes.SettingsConfig) {
        super(config);
    }

    create() {
        onHostChangeGames(this);
    }

    updateFpsText() {
    }

    update() {
        this.updateFpsText();
    }
}
