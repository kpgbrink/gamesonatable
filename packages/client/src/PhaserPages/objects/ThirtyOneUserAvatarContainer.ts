import { User } from "api";
import UserAvatarContainer from "./UserAvatarContainer";

export default class ThirtyOneUserAvatarContainer extends UserAvatarContainer {
    lives: number = 3;

    constructor(scene: Phaser.Scene, x: number, y: number, user: User) {
        super(scene, x, y, user);
    }
}