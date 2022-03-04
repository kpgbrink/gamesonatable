import Phaser from "phaser";
import { socketOffOnSceneShutdown } from "../../tools/objects/Tools";
import { onPlayerChangeGames } from "./OnPlayerChangeGames";


export default class PlayerScene extends Phaser.Scene {
    constructor(config: Phaser.Types.Scenes.SettingsConfig) {
        super(config);
    }

    create() {
        onPlayerChangeGames(this);
        socketOffOnSceneShutdown(this);
    }

    updateFpsText() {
    }

    update() {
        this.updateFpsText();
    }
}
