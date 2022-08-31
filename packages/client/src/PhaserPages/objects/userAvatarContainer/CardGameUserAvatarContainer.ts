import { User } from 'api';
import { PlayerCardHandData } from 'api/src/data/datas/CardData';
import UserAvatarContainer from "../UserAvatarContainer";

export abstract class CardGameUserAvatarContainer<T extends PlayerCardHandData> extends UserAvatarContainer {
    playerCardHandState: T;

    constructor(scene: Phaser.Scene, x: number, y: number, user: User) {
        super(scene, x, y, user);
        this.playerCardHandState = this.createPlayerCardHandData();
    }

    abstract createPlayerCardHandData(): T;

}