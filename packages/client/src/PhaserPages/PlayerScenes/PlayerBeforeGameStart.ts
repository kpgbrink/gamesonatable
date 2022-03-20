import { addUserNameText, makeMyUserAvatarInCenterOfPlayerScreen } from "../tools/objects/Tools";
import UserAvatarContainer, { loadUserAvatarSprites } from "../tools/objects/UserAvatarContainer";
import PlayerScene from "./tools/PlayerScene";

export default class PlayerBeforeGameStart extends PlayerScene {
    userAvatarContainer: UserAvatarContainer | null;

    constructor() {
        super({ key: 'PlayerBeforeGameStart' });
        this.userAvatarContainer = null;
    }

    preload() {
    }

    create() {
        super.create();
        addUserNameText(this);
        loadUserAvatarSprites(this);
        makeMyUserAvatarInCenterOfPlayerScreen(this, this.userAvatarContainer);
    }

    update() {

    }
}


