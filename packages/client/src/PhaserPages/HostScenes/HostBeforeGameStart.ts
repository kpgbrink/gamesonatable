import { RoomData } from "api";
import socket from "../../SocketConnection";
import { persistentData } from "../tools/objects/PersistantData";
import { DegreesToRadians, getScreenCenter } from "../tools/objects/Tools";
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
            const onSizeChange = (userAvatarContainer: UserAvatarContainer) => {
                userAvatarContainer.setInteractive();
                this.input.setDraggable(userAvatarContainer);
            };
            const screenCenter = getScreenCenter(this);
            // TODO put then in the correct rotation if rotation is set
            const userAvatarContainer = new UserAvatarContainer(this, screenCenter.x + Math.random() - .5, screenCenter.y + Math.random() - .5, user, onSizeChange);
            // if the rotation is already set then set the location to the correct rotation
            if (user.rotation) {
                userAvatarContainer.rotation = user.rotation;
                userAvatarContainer.x = screenCenter.x + (850 * Math.cos(user.rotation + DegreesToRadians(90)));
                userAvatarContainer.y = screenCenter.y + (850 * Math.sin(user.rotation + DegreesToRadians(90)));
            }

            this.add.existing(userAvatarContainer);
            this.userAvatars.push(userAvatarContainer);
            userAvatarContainer.on('pointerover', () => {
                userAvatarContainer?.bodyImage?.setTint(0x44ff44);
                userAvatarContainer?.baseImage?.setTint(0x44ff44);
                userAvatarContainer?.legsImage?.setTint(0x44ff44);
            });
            userAvatarContainer.on('pointerout', () => {
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
        const screenCenter = getScreenCenter(this);
        // slowly move user avatars to edge of table
        this.userAvatars.forEach((userAvatar) => {
            // calculate distance from center
            const distanceFromCenter = Math.sqrt(Math.pow(userAvatar.x - screenCenter.x, 2) + Math.pow(userAvatar.y - screenCenter.y, 2));
            // increase distance from center to make it to the outside of circle
            const distanceFromCenterToOutside = (() => {
                // if distance from center is higher than 850 then return 850
                if (distanceFromCenter > 850) return 850;
                // if distance from center is lower than 0 then return 0
                return distanceFromCenter + .5;
            })();
            // calculate angle from center to user avatar
            const angleFromCenterToUserAvatar = Math.atan2(userAvatar.y - screenCenter.y, userAvatar.x - screenCenter.x);
            // calculate new x and y position
            const newX = screenCenter.x + distanceFromCenterToOutside * Math.cos(angleFromCenterToUserAvatar);
            const newY = screenCenter.y + distanceFromCenterToOutside * Math.sin(angleFromCenterToUserAvatar);
            // move user avatar to new position
            userAvatar.x = newX;
            userAvatar.y = newY;
            // rotate user avatar to face the center
            userAvatar.rotation = angleFromCenterToUserAvatar - DegreesToRadians(90);
            // update the avatar rotations to server if changed
            // but don't make the update send things out to everyone else because it doesn't really matter to the others atm.
            (() => {
                const user = persistentData.roomData?.users.find((user) => user.id === userAvatar.user.id);
                if (!user) return;
                if (user.rotation === userAvatar.rotation) return;
                socket.emit('set player rotation', userAvatar.user.id, userAvatar.rotation);
                user.rotation = userAvatar.rotation;
            })();
        });
    }

}
