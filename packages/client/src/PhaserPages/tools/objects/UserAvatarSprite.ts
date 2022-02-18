import { RoomData, UserAvatar } from "api";
import Phaser from "phaser";
import socket from "../../../SocketConnection";
import { avatarImages } from "./avatarImages.generated";
import { randomIndex } from "./Tools";

const playerFolder = 'assets/player/';

export const generateRandomUserAvatar = (): UserAvatar => {
    const base = randomIndex(avatarImages.base);
    const beard = randomIndex(avatarImages.beard);
    const body = randomIndex(avatarImages.body);
    const cloak = randomIndex(avatarImages.cloak);
    const gloves = randomIndex(avatarImages.gloves);
    const boots = randomIndex(avatarImages.boots);
    const hair = randomIndex(avatarImages.hair);
    const head = randomIndex(avatarImages.head);
    const legs = randomIndex(avatarImages.legs);
    const userAvatar = { base, beard, body, cloak, gloves, boots, hair, head, legs };
    socket.emit('set player avatar', userAvatar);
    return userAvatar;
}

export const loadUserAvatarSprites = (scene: Phaser.Scene) => {
    socket.on('room data', (roomData: RoomData) => {
        // check if persistant data is equal to room data
        // if (persistentData.roomData?.users === roomData.users) {
        //     console.log('they the same');
        //     return;
        // }
        roomData.users.forEach(user => {
            const userId = user.id;
            const userAvatar = user.userAvatar;
            if (!userAvatar) return;
            console.log(user);
            console.log(roomData.users.length);
            scene.load.image(`${userId}-base`, `${playerFolder}base/${avatarImages.base[userAvatar.base]}`);
            scene.load.image(`${userId}-beard`, `${playerFolder}beard/${avatarImages.beard[userAvatar.beard]}`);
            scene.load.image(`${userId}-body`, `${playerFolder}body/${avatarImages.body[userAvatar.body]}`);
            scene.load.image(`${userId}-cloak`, `${playerFolder}cloak/${avatarImages.cloak[userAvatar.cloak]}`);
            scene.load.image(`${userId}-gloves`, `${playerFolder}gloves/${avatarImages.gloves[userAvatar.gloves]}`);
            scene.load.image(`${userId}-boots`, `${playerFolder}boots/${avatarImages.boots[userAvatar.boots]}`);
            scene.load.image(`${userId}-hair`, `${playerFolder}hair/${avatarImages.hair[userAvatar.hair]}`);
            scene.load.image(`${userId}-head`, `${playerFolder}head/${avatarImages.head[userAvatar.head]}`);
            scene.load.image(`${userId}-legs`, `${playerFolder}legs/${avatarImages.legs[userAvatar.legs]}`);
            scene.load.start();
        });
    });
}

export default class UserAvatarImage extends Phaser.GameObjects.Container {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y);
        console.log('the scene', this);
        // console.log('create user avatar image');
        scene.load.on('filecomplete', (key: string, type: any, data: any) => {

        });
        scene.load.on('complete', () => {
            this.loadUserAvatarImages();
        });
    }

    public loadUserAvatarImages() {
        if (!this.scene) return;
        console.log('the scene in loadUserAvatarImage');
        const addImage = (image: string) => {
            const imageObject = this.scene.add.image(0, 0, image);
            if (!imageObject) return;
            this.add(imageObject);
        }
        // Hello
        const userId = socket.id;
        addImage(`${userId}-cloak`);
        addImage(`${userId}-body`);
        addImage(`${userId}-base`);
        addImage(`${userId}-beard`);
        addImage(`${userId}-gloves`);
        addImage(`${userId}-boots`);
        addImage(`${userId}-hair`);
        addImage(`${userId}-head`);
        addImage(`${userId}-legs`);
    }
}