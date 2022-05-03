import { User } from "api";
import ThirtyOneUserAvatarContainer from "../../../../objects/ThirtyOneUserAvatarContainer";
import { HostUserAvatarsAroundTableGame } from "./HostUserAvatarsAroundTableGame";


export default class ThirtyOneHostUserAvatarsAroundTableGame extends HostUserAvatarsAroundTableGame {
    userAvatarContainers: ThirtyOneUserAvatarContainer[] = [];

    constructor(scene: Phaser.Scene) {
        super(scene);
    }

    createUserAvatarContainer(x: number, y: number, user: User) {
        console.log('create user avatar override is running');
        const userAvatarContainer = new ThirtyOneUserAvatarContainer(this.scene, x, y, user);
        return userAvatarContainer;
    }

    update(time: number, delta: number) {
        super.update(time, delta);
    }
}