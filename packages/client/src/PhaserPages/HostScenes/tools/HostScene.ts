import Phaser from "phaser";
import { socketOffOnSceneShutdown } from "../../tools/objects/Tools";
import { loadUserAvatarSprites } from "../../tools/objects/UserAvatarContainer";
import { onHostChangeGames } from "./OnHostChangeGames";


export default class HostScene extends Phaser.Scene {
    tableHeight = 1700;
    tableWidth = 1776;
    tableOvalWidth = 1632 - 310;
    constructor(config: Phaser.Types.Scenes.SettingsConfig) {
        super(config);
    }

    create() {
        onHostChangeGames(this);
        socketOffOnSceneShutdown(this);
        loadUserAvatarSprites(this);
    }

    updateFpsText() {
    }

    update() {
        this.updateFpsText();
    }
}
