import Phaser from "phaser";
import { addFullScreenButton, socketOffOnSceneShutdown } from "../../objects/Tools";
import { loadUserAvatarSprites } from "../../objects/UserAvatarContainer";
import { onHostChangeGames } from "../tools/OnHostChangeGames";


export default class HostScene extends Phaser.Scene {
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
