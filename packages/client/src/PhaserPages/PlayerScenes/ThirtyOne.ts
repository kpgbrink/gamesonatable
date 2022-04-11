import { Cards } from "../objects/Cards";
import { PlayerCardHand } from "./playerObjects/PlayerCardHand";
import PlayerScene from "./playerObjects/PlayerScene";


export default class ThirtyOne extends PlayerScene {
    playerCardHand: PlayerCardHand | null;

    constructor() {
        super({ key: 'ThirtyOne' });
        this.playerCardHand = null;
    }

    preload() {
        Cards.preload(this);
    }

    create() {
        super.create();
        this.playerCardHand = new PlayerCardHand(this);
        this.playerCardHand.create();
    }

    update(time: number, delta: number) {
        this.playerCardHand?.update(time, delta);
    }
}
