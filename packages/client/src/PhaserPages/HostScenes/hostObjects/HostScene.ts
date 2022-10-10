import Phaser from "phaser";
import socket from "../../../SocketConnection";
import { addFullScreenButton, socketOffOnSceneShutdown } from "../../objects/Tools";
import { loadUserAvatarSprites } from "../../objects/UserAvatarContainer";
import { onHostChangeGames } from "../hostTools/OnHostChangeGames";


export default class HostScene extends Phaser.Scene {

    create() {
        socket.off();
        onHostChangeGames(this);
        socketOffOnSceneShutdown(this);
        loadUserAvatarSprites(this);
        addFullScreenButton(this);
        this.scale.refresh();
    }

    update(time: number, delta: number) {
    }
}
