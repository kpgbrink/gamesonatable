import Phaser from "phaser";
import { socketOffOnSceneShutdown } from "../../tools/objects/Tools";
import { onHostChangeGames } from "./OnHostChangeGames";


export default class HostScene extends Phaser.Scene {
    constructor(config: Phaser.Types.Scenes.SettingsConfig) {
        super(config);
    }

    create() {
        onHostChangeGames(this);
        socketOffOnSceneShutdown(this);
    }

    updateFpsText() {
    }

    update() {
        this.updateFpsText();
    }
}
