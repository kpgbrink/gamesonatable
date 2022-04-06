import Phaser from "phaser";
import { addFullScreenButton, socketOffOnSceneShutdown } from "../../objects/Tools";
import UserAvatarContainer from "../../objects/UserAvatarContainer";
import { onPlayerChangeGames } from "../playerTools/OnPlayerChangeGames";


export default class PlayerScene extends Phaser.Scene {
    userAvatarContainer: UserAvatarContainer | null;

    constructor(config: Phaser.Types.Scenes.SettingsConfig) {
        super(config);
        this.userAvatarContainer = null;
    }

    create() {
        onPlayerChangeGames(this);
        socketOffOnSceneShutdown(this);
        addFullScreenButton(this);
    }
}
