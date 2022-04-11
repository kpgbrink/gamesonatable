import Phaser from "phaser";
import { addFullScreenButton, socketOffOnSceneShutdown } from "../../objects/Tools";
import { loadUserAvatarSprites } from "../../objects/UserAvatarContainer";
import { onHostChangeGames } from "../hostTools/OnHostChangeGames";


export default class HostScene extends Phaser.Scene {

    create() {
        onHostChangeGames(this);
        socketOffOnSceneShutdown(this);
        loadUserAvatarSprites(this);
        addFullScreenButton(this);
    }

    update(time: number, delta: number) {
    }
}
