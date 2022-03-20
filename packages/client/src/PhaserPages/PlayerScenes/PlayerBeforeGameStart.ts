import socket from "../../SocketConnection";
import { persistentData } from "../tools/objects/PersistantData";
import { addUserNameText, getScreenCenter } from "../tools/objects/Tools";
import UserAvatarContainer, { loadUserAvatarSprites, makeMyUserAvatar } from "../tools/objects/UserAvatarContainer";
import PlayerScene from "./tools/PlayerScene";

export default class PlayerBeforeGameStart extends PlayerScene {
    userAvatarContainer: UserAvatarContainer | null;

    constructor() {
        super({ key: 'PlayerBeforeGameStart' });
        this.userAvatarContainer = null;
    }

    preload() {
        // this.load.atlas('cards', 'assets/cards/cards.png', 'assets/cards/cards.json');
    }

    create() {
        super.create();
        addUserNameText(this);
        loadUserAvatarSprites(this);
        var screenCenter = getScreenCenter(this);

        (() => {
            this.userAvatarContainer = null;
            this.userAvatarContainer = makeMyUserAvatar(this, screenCenter.x, screenCenter.y, this.userAvatarContainer) || this.userAvatarContainer;
            socket.on('room data', (roomData) => {
                persistentData.roomData = roomData;
                if (this.userAvatarContainer) return;
                this.userAvatarContainer = makeMyUserAvatar(this, screenCenter.x, screenCenter.y, this.userAvatarContainer) || this.userAvatarContainer;
            });
        })()
    }

    update() {

    }
}


