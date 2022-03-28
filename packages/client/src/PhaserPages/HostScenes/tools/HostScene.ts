import Phaser from "phaser";
import { addFullScreenButton, socketOffOnSceneShutdown } from "../../tools/objects/Tools";
import { loadUserAvatarSprites } from "../../tools/objects/UserAvatarContainer";
import { onHostChangeGames } from "./OnHostChangeGames";


export default class HostScene extends Phaser.Scene {
    table = {
        height: 1700,
        width: 1776,
        ovalWidth: 1632 - 310,
    };

    constructor(config: Phaser.Types.Scenes.SettingsConfig) {
        super(config);
    }

    create() {
        onHostChangeGames(this);
        socketOffOnSceneShutdown(this);
        loadUserAvatarSprites(this);
        addFullScreenButton(this);
    }

    update() {
    }
}
