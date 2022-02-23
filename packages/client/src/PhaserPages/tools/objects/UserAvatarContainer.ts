import { RoomData, UserAvatar } from "api";
import Phaser from "phaser";
import socket from "../../../SocketConnection";
import { avatarImages } from "./avatarImages.generated";
import { loadIfNotLoaded, randomIndex } from "./Tools";

const playerFolder = 'assets/player/';

// Random change of returning a -1 
const randomNegativeOne = (negative1Chance: number) => {
    return Math.random() < negative1Chance ? -1 : null;
}


export const generateRandomUserAvatar = (): UserAvatar => {
    const base = randomIndex(avatarImages.base);
    const beard = randomNegativeOne(.8) || randomIndex(avatarImages.beard);
    const body = randomNegativeOne(.01) || randomIndex(avatarImages.body);
    const cloak = randomNegativeOne(.99) || randomIndex(avatarImages.cloak);
    const gloves = randomNegativeOne(.60) || randomIndex(avatarImages.gloves);
    const boots = randomNegativeOne(.05) || randomIndex(avatarImages.boots);
    const hair = randomNegativeOne(.10) || randomIndex(avatarImages.hair);
    const head = randomNegativeOne(.15) || randomIndex(avatarImages.head);
    const legs = randomNegativeOne(.03) || randomIndex(avatarImages.legs);
    const userAvatar = { base, beard, body, cloak, gloves, boots, hair, head, legs };
    console.log(userAvatar);
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
            if (userAvatar.cloak !== -1) {
                loadIfNotLoaded(scene, `${userId}-cloak`, `${playerFolder}cloak/${avatarImages.cloak[userAvatar.cloak]}`);
            }
            if (userAvatar.gloves !== -1) {
                loadIfNotLoaded(scene, `${userId}-gloves`, `${playerFolder}gloves/${avatarImages.gloves[userAvatar.gloves]}`);
            }
            if (userAvatar.body !== -1) {
                loadIfNotLoaded(scene, `${userId}-body`, `${playerFolder}body/${avatarImages.body[userAvatar.body]}`);
            }
            if (userAvatar.beard !== -1) {
                loadIfNotLoaded(scene, `${userId}-beard`, `${playerFolder}beard/${avatarImages.beard[userAvatar.beard]}`);
            }
            if (userAvatar.boots !== -1) {
                loadIfNotLoaded(scene, `${userId}-boots`, `${playerFolder}boots/${avatarImages.boots[userAvatar.boots]}`);
            }
            if (userAvatar.hair !== -1) {
                loadIfNotLoaded(scene, `${userId}-hair`, `${playerFolder}hair/${avatarImages.hair[userAvatar.hair]}`);
            }
            if (userAvatar.head !== -1) {
                loadIfNotLoaded(scene, `${userId}-head`, `${playerFolder}head/${avatarImages.head[userAvatar.head]}`);
            }
            if (userAvatar.legs !== -1) {
                loadIfNotLoaded(scene, `${userId}-legs`, `${playerFolder}legs/${avatarImages.legs[userAvatar.legs]}`);
            }
            scene.load.start();
        });
    });
}

export const makeMyUserAvatar = (scene: Phaser.Scene, x: number, y: number, userAvatarContainer: UserAvatarContainer | null) => {
    if (!socket.id || userAvatarContainer) return;
    userAvatarContainer = new UserAvatarContainer(scene, x, y, socket.id);
    scene.add.existing(userAvatarContainer);
    userAvatarContainer.setScale(10);
    return userAvatarContainer;
}

export default class UserAvatarContainer extends Phaser.GameObjects.Container {
    userId: string;
    cloakImage: Phaser.GameObjects.Image | null;
    bodyImage: Phaser.GameObjects.Image | null;
    baseImage: Phaser.GameObjects.Image | null;
    beardImage: Phaser.GameObjects.Image | null;
    glovesImage: Phaser.GameObjects.Image | null;
    bootsImage: Phaser.GameObjects.Image | null;
    hairImage: Phaser.GameObjects.Image | null;
    headImage: Phaser.GameObjects.Image | null;
    legsImage: Phaser.GameObjects.Image | null;

    constructor(scene: Phaser.Scene, x: number, y: number, userId: string) {
        super(scene, x, y);
        this.userId = userId;
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
        const addImage = (image: string) => {
            if (!this.scene.textures.exists(image)) return null;
            const imageObject = this.scene.add.image(0, 0, image);
            if (!imageObject) return null;
            this.add(imageObject);
            return imageObject;
        }
        // Hello
        const userId = this.userId;
        if (!userId) return;
        if (this.cloakImage) this.cloakImage.destroy();
        this.cloakImage = addImage(`${userId}-cloak`);
        if (this.baseImage) this.baseImage.destroy();
        this.baseImage = addImage(`${userId}-base`);
        if (this.bodyImage) this.bodyImage.destroy();
        this.bodyImage = addImage(`${userId}-body`);
        if (this.beardImage) this.beardImage.destroy();
        this.beardImage = addImage(`${userId}-beard`);
        if (this.glovesImage) this.glovesImage.destroy();
        this.glovesImage = addImage(`${userId}-gloves`);
        if (this.bootsImage) this.bootsImage.destroy();
        this.bootsImage = addImage(`${userId}-boots`);
        if (this.hairImage) this.hairImage.destroy();
        this.hairImage = addImage(`${userId}-hair`);
        if (this.headImage) this.headImage.destroy();
        this.headImage = addImage(`${userId}-head`);
        if (this.legsImage) this.legsImage.destroy();
        this.legsImage = addImage(`${userId}-legs`);
        [this.cloakImage, this.baseImage, this.bodyImage, this.beardImage, this.glovesImage, this.bootsImage, this.hairImage, this.headImage, this.legsImage].reverse().forEach(image => {
            if (!image) return;
            this.sendToBack(image);
        });
    }
}