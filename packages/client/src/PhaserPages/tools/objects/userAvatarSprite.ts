import { UserAvatar } from "api";
import Phaser from "phaser";
import { avatarImages } from "./avatarImages.generated";


export const loadUserAvatarSprites = (scene: Phaser.Scene, userAvatar: UserAvatar) => {
    console.log("loadUserAvatarSprites");
    console.log('userAvatar', userAvatar);
    scene.load.image('base', `assets/player/base/${avatarImages.base[userAvatar.base]}`);
    scene.load.image('beard', `assets/player/beard/${avatarImages.beard[userAvatar.beard]}`);
    scene.load.image('body', `assets/player/body/${avatarImages.body[userAvatar.body]}`);
    scene.load.image('boots', `assets/player/boots/${avatarImages.boots[userAvatar.boots]}`);
    scene.load.image('hair', `assets/player/hair/${avatarImages.hair[userAvatar.hair]}`);
    scene.load.image('head', `assets/player/head/${avatarImages.head[userAvatar.head]}`);
    scene.load.image('legs', `assets/player/legs/${avatarImages.legs[userAvatar.legs]}`);
}

export default class UserAvatarSprite extends Phaser.Physics.Arcade.Sprite {

}
