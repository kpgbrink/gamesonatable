import { RoomData } from "api";
import Phaser from "phaser";
import socket from "../../SocketConnection";
import { persistentData } from "../tools/objects/PersistantData";
import UserAvatarContainer, { loadUserAvatarSprites } from "../tools/objects/UserAvatarContainer";

export default class HostBeforeGameStart extends Phaser.Scene {
    constructor() {
        super({ key: 'HostBeforeGameStart' });
    }

    preload() {
    }

    addUsers(roomData: RoomData) {
        // Create a user avatar for each user
        roomData.users.forEach((user) => {
            const userAvatarContainer = new UserAvatarContainer(this, 150, 150, user.id);
            this.add.existing(userAvatarContainer);
            userAvatarContainer.setScale(5);
        });
    }

    create() {
        loadUserAvatarSprites(this);
        socket.emit('set player current scene', 'PlayerBeforeGameStart');
        socket.on('room data', (roomData: RoomData) => {
            persistentData.roomData = roomData;
            this.addUsers(roomData);
        });
        socket.emit('get room data');

    }

    updateFpsText() {
    }

    update() {
    }
}
