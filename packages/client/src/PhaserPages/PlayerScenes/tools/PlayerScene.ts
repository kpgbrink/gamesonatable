import Phaser from "phaser";
import { socketOffOnSceneShutdown } from "../../tools/objects/Tools";
import UserAvatarContainer from "../../tools/objects/UserAvatarContainer";
import { onPlayerChangeGames } from "./OnPlayerChangeGames";


export default class PlayerScene extends Phaser.Scene {
    userAvatarContainer: UserAvatarContainer | null;

    constructor(config: Phaser.Types.Scenes.SettingsConfig) {
        super(config);
        this.userAvatarContainer = null;
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
