import { User } from '@kbrink/api';
import { PlayerCardHandState } from '@kbrink/api/src/playerCardHandState/PlayerCardHandState';
import UserAvatarContainer from "../UserAvatarContainer";

export class CardGameUserAvatarContainer extends UserAvatarContainer {
    playerCardHandState: PlayerCardHandState;
    thirtyOneCardHandState: ThirtyOneCardHandState;

    constructor(scene: Phaser.Scene, x: number, y: number, user: User) {
        super(scene, x, y, user);
        this.playerCardHandState = new PlayerCardHandState(user.id);
    }
}