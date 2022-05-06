import { User } from "api";
import ThirtyOneUserAvatarContainer from "../../../../objects/ThirtyOneUserAvatarContainer";
import { HostUserAvatarsAroundTableGame } from "./HostUserAvatarsAroundTableGame";


export default class ThirtyOneHostUserAvatarsAroundTableGame extends HostUserAvatarsAroundTableGame {
    userAvatarContainers: ThirtyOneUserAvatarContainer[] = [];

    constructor(scene: Phaser.Scene) {
        super(scene);
    }

    getUsersInGame() {
        // only get users with lives still
        return this.userAvatarContainers.filter((userAvatar) => userAvatar.user.inGame).filter((userAvatar) => userAvatar.lives > 0);
    }

    createUserAvatarContainer(x: number, y: number, user: User) {
        const userAvatarContainer = new ThirtyOneUserAvatarContainer(this.scene, x, y, user);
        return userAvatarContainer;
    }

    update(time: number, delta: number) {
        super.update(time, delta);
    }
}