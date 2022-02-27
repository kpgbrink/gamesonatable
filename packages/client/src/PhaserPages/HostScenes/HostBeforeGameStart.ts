import { RoomData } from "api";
import Phaser from "phaser";
import socket from "../../SocketConnection";
import UserAvatarContainer, { loadUserAvatarSprites } from "../tools/objects/UserAvatarContainer";


export default class HostBeforeGameStart extends Phaser.Scene {
    userAvatars: UserAvatarContainer[] = [];

    constructor() {
        super({ key: 'HostBeforeGameStart' });
    }

    preload() {
    }

    addUsers(roomData: RoomData) {
        // Create a user avatar for each user
        roomData?.users.forEach((user) => {
            if (!user.userAvatar) return;
            if (this.userAvatars.find((userAvatar) => userAvatar.userId === user.id)) return;
            console.log('adding user avatar', user.userAvatar);
            const userAvatarContainer = new UserAvatarContainer(this, 150, 150, user.id);
            this.add.existing(userAvatarContainer);
            this.userAvatars.push(userAvatarContainer);

            userAvatarContainer.setSize(500, 500);
            userAvatarContainer.setScale(5);
            userAvatarContainer.setInteractive();
            this.input.setDraggable(userAvatarContainer);
        });
    }

    create() {
        socket.off();
        loadUserAvatarSprites(this);
        socket.emit('set player current scene', 'PlayerBeforeGameStart');
        console.log('my socket id', socket.id);
        socket.on('room data', (roomData: RoomData) => {
            this.addUsers(roomData);
        });
        socket.emit('get room data');
    }

    updateFpsText() {
    }

    update() {
    }
}
