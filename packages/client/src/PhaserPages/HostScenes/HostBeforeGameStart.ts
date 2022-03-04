import { RoomData } from "api";
import socket from "../../SocketConnection";
import UserAvatarContainer, { loadUserAvatarSprites } from "../tools/objects/UserAvatarContainer";
import HostScene from "./tools/HostScene";
import { onHostChangeGames } from "./tools/OnHostChangeGames";


export default class HostBeforeGameStart extends HostScene {
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
        super.create();
        onHostChangeGames(this);
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
