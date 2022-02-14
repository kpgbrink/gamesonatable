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
        roomData.users.forEach(user => {
            const userId = user.id;
            const userAvatar = user.userAvatar;
            if (!userAvatar) return;
            console.log('loading the user avatar');
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
    private base: Phaser.GameObjects.Image | null;
    private beard: Phaser.GameObjects.Image | null;
    private bodyImage: Phaser.GameObjects.Image | null;
    private boots: Phaser.GameObjects.Image | null;
    private cloak: Phaser.GameObjects.Image | null;
    private gloves: Phaser.GameObjects.Image | null;
    private hair: Phaser.GameObjects.Image | null;
    private head: Phaser.GameObjects.Image | null;
    private legs: Phaser.GameObjects.Image | null;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y);

        // console.log('create user avatar image');
        scene.load.on('filecomplete', (key: string, type: any, data: any) => {

        });
        this.base = null;
        this.beard = null;
        this.bodyImage = null;
        this.boots = null;
        this.cloak = null;
        this.gloves = null;
        this.hair = null;
        this.head = null;
        this.legs = null;
        scene.load.on('complete', () => {
            this.loadUserAvatarImages();
        });
    }

    public loadUserAvatarImages() {
        // Hello
        const userId = socket.id;
        this.cloak = this.scene.add.image(this.x, this.y, `${userId}-cloak`);
        this.cloak.setScale(10);
        this.base = this.scene.add.image(this.x, this.y, `${userId}-base`);
        this.base.setScale(10);
        this.beard = this.scene.add.image(this.x, this.y, `${userId}-beard`);
        this.beard.setScale(10);
        this.bodyImage = this.scene.add.image(this.x, this.y, `${userId}-body`);
        this.bodyImage.setScale(10);
        this.gloves = this.scene.add.image(this.x, this.y, `${userId}-gloves`);
        this.gloves.setScale(10);
        this.boots = this.scene.add.image(this.x, this.y, `${userId}-boots`);
        this.boots.setScale(10);
        this.hair = this.scene.add.image(this.x, this.y, `${userId}-hair`);
        this.hair.setScale(10);
        this.head = this.scene.add.image(this.x, this.y, `${userId}-head`);
        this.head.setScale(10);
        this.legs = this.scene.add.image(this.x, this.y, `${userId}-legs`);
        this.legs.setScale(10);
    }
}