import { RoomData } from "api";
import socket from "../../SocketConnection";
import { loadIfImageNotLoaded } from "../tools/objects/Tools";
import UserAvatarContainer from "../tools/objects/UserAvatarContainer";
import HostScene from "./tools/HostScene";
import { addUserAvatars, createTable, UserAvatarScene } from "./tools/HostTools";

export default class ThirtyOneHostScene extends HostScene implements UserAvatarScene {
    userAvatars: UserAvatarContainer[] = [];

    constructor() {
        super({ key: 'ThirtyOne' });
    }

    preload() {
        // this.load.atlas('cards', 'assets/atlas/cards.png', 'assets/atlas/cards.json');
        loadIfImageNotLoaded(this, 'table', 'assets/images/table.png');
    }

    create() {
        super.create();
        console.log('thirty one is running');
        // display the Phaser.VERSION
        createTable(this);
        socket.on('room data', (roomData: RoomData) => {
            addUserAvatars(this, roomData);
        });
    }
}
