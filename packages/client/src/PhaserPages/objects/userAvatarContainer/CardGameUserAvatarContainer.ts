import { User } from 'api';
import { PlayerCardHandState } from 'api/src/playerState/playerStates/PlayerCardHandState';
import UserAvatarContainer from "../UserAvatarContainer";

export abstract class CardGameUserAvatarContainer<T extends PlayerCardHandState> extends UserAvatarContainer {
    playerCardHandState: T;

    constructor(scene: Phaser.Scene, x: number, y: number, user: User) {
        super(scene, x, y, user);
        this.playerCardHandState = this.createPlayerCardHandState();
    }

    abstract createPlayerCardHandState(): T;

}