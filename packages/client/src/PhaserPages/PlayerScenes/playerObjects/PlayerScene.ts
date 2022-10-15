import Phaser from "phaser";
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';
import socket from "../../../SocketConnection";
import { addFullScreenButton, socketOffOnSceneShutdown } from "../../objects/Tools";
import UserAvatarContainer from "../../objects/UserAvatarContainer";
import { onPlayerChangeGames } from "../playerTools/OnPlayerChangeGames";


export default class PlayerScene extends Phaser.Scene {
    rexUI?: RexUIPlugin;

    userAvatarContainer: UserAvatarContainer | null;

    constructor(config: Phaser.Types.Scenes.SettingsConfig) {
        super(config);
        this.userAvatarContainer = null;
    }

    preload() {
        console.log('load rexUI');
    }

    create() {
        socket.off();
        onPlayerChangeGames(this);
        socketOffOnSceneShutdown(this);
        addFullScreenButton(this);
        socket.emit('get room data');
        this.scale.refresh();
        // add scale refresh event listener
        console.log('make player scene event');
        window.addEventListener('resizeSpecial', (e: any) => {
            console.log('resizeSpecial event happened');
            this.scale.refresh();

        });
    }

    // remove resize event listener on shutdown
    shutdown() {
        console.log('scene shutdown');
        // window.removeEventListener('resizeSpecial', () => { });
    }
}
