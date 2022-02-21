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
    baseDepth: number;
    cloakImage: Phaser.GameObjects.Image | null;
    bodyImage: Phaser.GameObjects.Image | null;
    baseImage: Phaser.GameObjects.Image | null;
    beardImage: Phaser.GameObjects.Image | null;
    glovesImage: Phaser.GameObjects.Image | null;
    bootsImage: Phaser.GameObjects.Image | null;
    hairImage: Phaser.GameObjects.Image | null;
    headImage: Phaser.GameObjects.Image | null;
    legsImage: Phaser.GameObjects.Image | null;

    constructor(scene: Phaser.Scene, x: number, y: number, userId: string, baseDepth: number) {
        super(scene, x, y);
        this.userId = userId;
        this.baseDepth = baseDepth;
        this.loadUserAvatarImages();
        scene.load.on('complete', () => {
            this.loadUserAvatarImages();
        });
        this.cloakImage = null;
        this.bodyImage = null;
        this.baseImage = null;
        this.beardImage = null;
        this.glovesImage = null;
        this.bootsImage = null;
        this.hairImage = null;
        this.headImage = null;
        this.legsImage = null;
    }

    public loadUserAvatarImages() {
        if (!this.scene) return;
        const addImage = (image: string, depth: number) => {
            if (!this.scene.textures.exists(image)) return null;
            const imageObject = this.scene.add.image(0, 0, image);
            imageObject.setDepth(this.baseDepth + depth);
            if (!imageObject) return null;
            this.add(imageObject);
            return imageObject;
        }
        // Hello
        const userId = this.userId;
        if (!userId) return;
        if (this.cloakImage) this.cloakImage.destroy();
        this.cloakImage = addImage(`${userId}-cloak`, 0);
        if (this.baseImage) this.baseImage.destroy();
        this.baseImage = addImage(`${userId}-base`, 2);
        if (this.bodyImage) this.bodyImage.destroy();
        this.bodyImage = addImage(`${userId}-body`, 1);
        if (this.beardImage) this.beardImage.destroy();
        this.beardImage = addImage(`${userId}-beard`, 3);
        if (this.glovesImage) this.glovesImage.destroy();
        this.glovesImage = addImage(`${userId}-gloves`, 4);
        if (this.bootsImage) this.bootsImage.destroy();
        this.bootsImage = addImage(`${userId}-boots`, 5);
        if (this.hairImage) this.hairImage.destroy();
        this.hairImage = addImage(`${userId}-hair`, 6);
        if (this.headImage) this.headImage.destroy();
        this.headImage = addImage(`${userId}-head`, 7);
        if (this.legsImage) this.legsImage.destroy();
        this.legsImage = addImage(`${userId}-legs`, 8);
        (() => {
            [this.cloakImage, this.baseImage, this.bodyImage, this.beardImage, this.glovesImage, this.bootsImage, this.hairImage, this.headImage, this.legsImage].reverse().forEach(image => {
                console.log(image);
                if (!image) return;
                this.sendToBack(image);
            });
        })();
    }
}