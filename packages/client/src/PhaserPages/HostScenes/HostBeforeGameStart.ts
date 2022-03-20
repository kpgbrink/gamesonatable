import { RoomData } from "api";
import socket from "../../SocketConnection";
import { getScreenCenter } from "../tools/objects/Tools";
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

            const onSizeChange = (userAvatarContainer: UserAvatarContainer) => {
                console.log('size changed');
                userAvatarContainer.setInteractive();
                this.input.setDraggable(userAvatarContainer);
            };
            const userAvatarContainer = new UserAvatarContainer(this, 250, 250, user, onSizeChange);
            this.add.existing(userAvatarContainer);
            this.userAvatars.push(userAvatarContainer);

            userAvatarContainer.on('pointerover', function () {
                console.log('hey');
                userAvatarContainer?.bodyImage?.setTint(0x44ff44);
                userAvatarContainer?.baseImage?.setTint(0x44ff44);
                userAvatarContainer?.legsImage?.setTint(0x44ff44);
            });
            userAvatarContainer.on('pointerout', function () {
                userAvatarContainer?.bodyImage?.clearTint();
                userAvatarContainer?.baseImage?.clearTint();
                userAvatarContainer?.legsImage?.clearTint();
            });
        });
    }

    create() {
        super.create();
        socket.emit('set player current scene', 'PlayerBeforeGameStart');
        socket.on('room data', (roomData: RoomData) => {
            this.addUsers(roomData);
        });
        this.input.on('drag', function (pointer: any, gameObject: any, dragX: number, dragY: number) {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });
        socket.emit('get room data');
        const screenCenter = getScreenCenter(this);

        this.add.circle(screenCenter.x, screenCenter.y, 850, 0xffffff);
    }

    updateFpsText() {
    }

    update() {
    }

}
