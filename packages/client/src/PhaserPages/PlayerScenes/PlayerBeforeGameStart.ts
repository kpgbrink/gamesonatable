import { addFullScreenButton, addUserNameText, loadIfNotLoaded, makeMyUserAvatarInCenterOfPlayerScreen } from "../tools/objects/Tools";
import UserAvatarContainer, { loadUserAvatarSprites } from "../tools/objects/UserAvatarContainer";
import PlayerScene from "./tools/PlayerScene";

export default class PlayerBeforeGameStart extends PlayerScene {
    userAvatarContainer: UserAvatarContainer | null;

    constructor() {
        super({ key: 'PlayerBeforeGameStart' });
        this.userAvatarContainer = null;
    }

    preload() {
        loadIfNotLoaded(this, 'fullscreen', 'assets/ui/fullscreen.png');
        loadIfNotLoaded(this, 'fullscreen-white', 'assets/ui/fullscreen-white.png');
    }

    create() {
        super.create();
        addUserNameText(this);
        loadUserAvatarSprites(this);
        makeMyUserAvatarInCenterOfPlayerScreen(this, this.userAvatarContainer);
        addFullScreenButton(this);
    }

    update() {

    }
}


