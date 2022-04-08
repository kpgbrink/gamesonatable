import { Cards } from "../objects/Cards";
import { PlayerCardHand } from "./playerObjects/PlayerCardHand";
import PlayerScene from "./playerObjects/PlayerScene";


export default class ThirtyOne extends PlayerScene {
    playerCardHand: PlayerCardHand;

    constructor() {
        super({ key: 'ThirtyOne' });
        this.playerCardHand = new PlayerCardHand(this);
    }

    preload() {
        Cards.preload(this);
    }

    create() {
        super.create();
        this.playerCardHand.create();
        // display the Phaser.VERSION
        console.log('thirty one is running');
    }

    update(time: number, delta: number) {
        this.playerCardHand.update(time, delta);
    }
}
