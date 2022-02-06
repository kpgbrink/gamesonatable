import { RoomData, UserAvatar } from "api";
import Phaser from "phaser";
import socket from "../../../SocketConnection";
import { avatarImages } from "./avatarImages.generated";
import { randomIndex } from "./tools";

const playerFolder = 'assets/player/';

export const loadUserAvatarSprites = (scene: Phaser.Scene) => {
    const userAvatar: UserAvatar = {
        base: randomIndex(avatarImages.base),
        beard: randomIndex(avatarImages.beard),
        body: randomIndex(avatarImages.body),
        boots: randomIndex(avatarImages.boots),
        cloak: randomIndex(avatarImages.cloak),
        gloves: randomIndex(avatarImages.gloves),
        hair: randomIndex(avatarImages.hair),
        head: randomIndex(avatarImages.head),
        legs: randomIndex(avatarImages.legs),
    };
    socket.emit('set avatar', userAvatar);
    socket.on('room data', (roomData: RoomData) => {
        console.log('load the avatar data');
        const userId = socket.id;
        scene.load.image(`cloak${userId}`, `${playerFolder}cloak/${avatarImages.cloak[userAvatar.cloak]}`);
        scene.load.image(`base${userId}`, `${playerFolder}base/${avatarImages.base[userAvatar.base]}`);
        scene.load.image(`beard${userId}`, `${playerFolder}beard/${avatarImages.beard[userAvatar.beard]}`);
        scene.load.image(`body${userId}`, `${playerFolder}body/${avatarImages.body[userAvatar.body]}`);
        scene.load.image(`gloves${userId}`, `${playerFolder}gloves/${avatarImages.gloves[userAvatar.gloves]}`);
        scene.load.image(`hair${userId}`, `${playerFolder}hair/${avatarImages.hair[userAvatar.hair]}`);
        scene.load.image(`head${userId}`, `${playerFolder}head/${avatarImages.head[userAvatar.head]}`);
        scene.load.image(`legs${userId}`, `${playerFolder}legs/${avatarImages.legs[userAvatar.legs]}`);
        scene.load.image(`boots${userId}`, `${playerFolder}boots/${avatarImages.boots[userAvatar.boots]}`);

        scene.load.start();
    });
    scene.load.on('filecomplete', (key: string, type: any, data: any) => {
        const userId = socket.id;
        const screenX = scene.cameras.main.worldView.x + scene.cameras.main.width;
        const screenY = scene.cameras.main.worldView.y + scene.cameras.main.height;
        const screenMiddleX = screenX / 2;
        const screenMiddleY = screenY / 2;
        console.log('file complete', key, `base${userId}`);

        const image = scene.add.image(screenMiddleX, screenMiddleY, key);
        image.setScale(10);
    });
}

export default class UserAvatarSprite extends Phaser.Game {

}
