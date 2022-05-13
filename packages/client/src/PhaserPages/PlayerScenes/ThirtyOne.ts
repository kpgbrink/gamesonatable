import { Cards } from "../objects/Cards";
import { ThirtyOneCardHand } from "./playerObjects/gameSpecificHands/ThirtyOneCardHand";
import PlayerScene from "./playerObjects/PlayerScene";


export default class ThirtyOne extends PlayerScene {
    playerCardHand: ThirtyOneCardHand | null;

    constructor() {
        super({ key: 'ThirtyOne' });
        this.playerCardHand = null;
    }

    preload() {
        Cards.preload(this);
    }

    create() {
        super.create();
        this.playerCardHand = new ThirtyOneCardHand(this);
        this.playerCardHand.create();
    }

    update(time: number, delta: number) {
        this.playerCardHand?.update(time, delta);
    }
}
