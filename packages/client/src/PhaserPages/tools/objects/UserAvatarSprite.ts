import { RoomData, UserAvatar } from "api";
import Phaser from "phaser";
import socket from "../../../SocketConnection";
import { avatarImages } from "./avatarImages.generated";
import { loadIfNotLoaded, randomIndex } from "./Tools";

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
        roomData.users.forEach(user => {
            const userId = user.id;
            const userAvatar = user.userAvatar;
            if (!userAvatar) return;
            loadIfNotLoaded(scene, `${userId}-base`, `${playerFolder}base/${avatarImages.base[userAvatar.base]}`);
            loadIfNotLoaded(scene, `${userId}-beard`, `${playerFolder}beard/${avatarImages.beard[userAvatar.beard]}`);
            loadIfNotLoaded(scene, `${userId}-body`, `${playerFolder}body/${avatarImages.body[userAvatar.body]}`);
            loadIfNotLoaded(scene, `${userId}-cloak`, `${playerFolder}cloak/${avatarImages.cloak[userAvatar.cloak]}`);
            loadIfNotLoaded(scene, `${userId}-gloves`, `${playerFolder}gloves/${avatarImages.gloves[userAvatar.gloves]}`);
            loadIfNotLoaded(scene, `${userId}-boots`, `${playerFolder}boots/${avatarImages.boots[userAvatar.boots]}`);
            loadIfNotLoaded(scene, `${userId}-hair`, `${playerFolder}hair/${avatarImages.hair[userAvatar.hair]}`);
            loadIfNotLoaded(scene, `${userId}-head`, `${playerFolder}head/${avatarImages.head[userAvatar.head]}`);
            loadIfNotLoaded(scene, `${userId}-legs`, `${playerFolder}legs/${avatarImages.legs[userAvatar.legs]}`);

            scene.load.start();
        });
    });
}

export default class UserAvatarImage extends Phaser.GameObjects.Container {
    userId: string;
    constructor(scene: Phaser.Scene, x: number, y: number, userId: string) {
        super(scene, x, y);
        this.userId = userId;
        scene.load.on('filecomplete', (key: string, type: any, data: any) => {

        });

        this.loadUserAvatarImages();
        scene.load.on('complete', () => {
            this.loadUserAvatarImages();
        });
    }

    public loadUserAvatarImages() {
        if (!this.scene) return;
        const addImage = (image: string) => {
            if (!this.scene.textures.exists(image)) return;
            const imageObject = this.scene.add.image(0, 0, image);
            if (!imageObject) return;
            this.add(imageObject);
        }
        // Hello
        const userId = this.userId;
        if (!userId) return;
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