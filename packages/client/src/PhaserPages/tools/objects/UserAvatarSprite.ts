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
    return { base, beard, body, cloak, gloves, boots, hair, head, legs };
}

export const loadUserAvatarSprites = (scene: Phaser.Scene) => {
    const userAvatar = generateRandomUserAvatar();
    socket.emit('set player avatar', userAvatar);
    socket.on('room data', (roomData: RoomData) => {
        console.log('load the avatar data');
        const user = roomData.users.find(u => u.id === socket.id);
        console.log(user);
        const userId = socket.id;
        scene.load.image(`base${userId}`, `${playerFolder}base/${avatarImages.base[userAvatar.base]}`);
        scene.load.image(`beard${userId}`, `${playerFolder}beard/${avatarImages.beard[userAvatar.beard]}`);
        scene.load.image(`body${userId}`, `${playerFolder}body/${avatarImages.body[userAvatar.body]}`);
        scene.load.image(`gloves${userId}`, `${playerFolder}gloves/${avatarImages.gloves[userAvatar.gloves]}`);
        scene.load.image(`hair${userId}`, `${playerFolder}hair/${avatarImages.hair[userAvatar.hair]}`);
        scene.load.image(`head${userId}`, `${playerFolder}head/${avatarImages.head[userAvatar.head]}`);
        scene.load.image(`legs${userId}`, `${playerFolder}legs/${avatarImages.legs[userAvatar.legs]}`);
        scene.load.image(`boots${userId}`, `${playerFolder}boots/${avatarImages.boots[userAvatar.boots]}`);
        scene.load.image(`cloak${userId}`, `${playerFolder}cloak/${avatarImages.cloak[userAvatar.cloak]}`);

        scene.load.start();
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
        // this.loadUserAvatarImages();
    }

    public loadUserAvatarImages() {
        // Hello
        console.log('loading images complete');
        const userId = socket.id;
        this.cloak = this.scene.add.image(this.x, this.y, `cloak${userId}`);
        this.cloak.setScale(10);
        this.base = this.scene.add.image(this.x, this.y, `base${userId}`);
        this.base.setScale(10);
        this.beard = this.scene.add.image(this.x, this.y, `beard${userId}`);
        this.beard.setScale(10);
        this.bodyImage = this.scene.add.image(this.x, this.y, `body${userId}`);
        this.bodyImage.setScale(10);
        this.gloves = this.scene.add.image(this.x, this.y, `gloves${userId}`);
        this.gloves.setScale(10);
        this.boots = this.scene.add.image(this.x, this.y, `boots${userId}`);
        this.boots.setScale(10);
        this.hair = this.scene.add.image(this.x, this.y, `hair${userId}`);
        this.hair.setScale(10);
        this.head = this.scene.add.image(this.x, this.y, `head${userId}`);
        this.head.setScale(10);
        this.legs = this.scene.add.image(this.x, this.y, `legs${userId}`);
        this.legs.setScale(10);
    }
}