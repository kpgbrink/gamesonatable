import { addFullScreenButton, addUserNameText, loadIfSpriteSheetNotLoaded, makeMyUserAvatarInCenterOfPlayerScreen } from "../tools/objects/Tools";
import UserAvatarContainer, { loadUserAvatarSprites } from "../tools/objects/UserAvatarContainer";
import PlayerScene from "./tools/PlayerScene";

export default class PlayerBeforeGameStart extends PlayerScene {
    userAvatarContainer: UserAvatarContainer | null;

    constructor() {
        super({ key: 'PlayerBeforeGameStart' });
        this.userAvatarContainer = null;
    }

    preload() {
        loadIfSpriteSheetNotLoaded(this, 'fullscreen', 'assets/ui/fullscreen.png', { frameWidth: 64, frameHeight: 64 });
        loadIfSpriteSheetNotLoaded(this, 'fullscreen-white', 'assets/ui/fullscreen-white.png', { frameWidth: 64, frameHeight: 64 });
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


