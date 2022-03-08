import { RoomData } from "api";
import socket from "../../SocketConnection";
import UserAvatarContainer from "../tools/objects/UserAvatarContainer";
import HostScene from "./tools/HostScene";


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
            if (this.userAvatars.find((userAvatar) => userAvatar.user.id === user.id)) return;
            console.log('adding user avatar', user.userAvatar);
            const userAvatarContainer = new UserAvatarContainer(this, 250, 250, user);
            this.add.existing(userAvatarContainer);
            this.userAvatars.push(userAvatarContainer);

            userAvatarContainer.setSize(100, 100);
            userAvatarContainer.setInteractive();
            this.input.setDraggable(userAvatarContainer);
            userAvatarContainer.on('pointerover', function () {
                console.log('hey');
                userAvatarContainer?.bodyImage?.setTint(0x44ff44);
            });
            userAvatarContainer.on('pointerout', function () {
                userAvatarContainer?.bodyImage?.clearTint();
            });

        });
    }

    create() {
        super.create();
        socket.emit('set player current scene', 'PlayerBeforeGameStart');
        console.log('my socket id', socket.id);
        socket.on('room data', (roomData: RoomData) => {
            this.addUsers(roomData);
        });
        this.input.on('drag', function (pointer: any, gameObject: any, dragX: number, dragY: number) {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });
        socket.emit('get room data');
    }

    updateFpsText() {
    }

    update() {
    }

}
