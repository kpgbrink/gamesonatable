import Phaser from "phaser";
import socket from "../../SocketConnection";
import { addUserNameText } from "../tools/objects/Tools";
import UserAvatarContainer, { loadUserAvatarSprites, makeMyUserAvatar } from "../tools/objects/UserAvatarContainer";
import { onChangeGames } from "./tools/OnChangeGames";

export default class PlayerBeforeGameStart extends Phaser.Scene {
    userAvatarContainer: UserAvatarContainer | null;

    constructor() {
        super({ key: 'PlayerBeforeGameStart' });
        this.userAvatarContainer = null;
    }

    preload() {
        // this.load.atlas('cards', 'assets/cards/cards.png', 'assets/cards/cards.json');
    }

    create() {
        socket.off();
        onChangeGames(this.scene);
        addUserNameText(this);
        loadUserAvatarSprites(this);
        const screenX = this.cameras.main.worldView.x + this.cameras.main.width;
        const screenY = this.cameras.main.worldView.y + this.cameras.main.height;
        const screenMiddleX = screenX / 2;
        const screenMiddleY = screenY / 2;
        // Make my user avatar
        (() => {
            this.userAvatarContainer = null;
            this.userAvatarContainer = makeMyUserAvatar(this, screenMiddleX, screenMiddleY, this.userAvatarContainer) || this.userAvatarContainer;
            socket.on('connect', () => {
                this.userAvatarContainer = makeMyUserAvatar(this, screenMiddleX, screenMiddleY, this.userAvatarContainer) || this.userAvatarContainer;
                console.log(this.userAvatarContainer);
            });
        })()
    }

    update() {

    }
}
