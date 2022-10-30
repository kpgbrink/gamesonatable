import { Cards } from "../objects/Cards";
import { ThirtyOneCardHand } from "./playerObjects/playerCardHands/ThirtyOneCardHand";
import PlayerScene from "./playerObjects/PlayerScene";


export default class PlayerThirtyOneScene extends PlayerScene {
    playerCardHand: ThirtyOneCardHand | null;
    counter = 0;

    constructor() {
        super({ key: 'PlayerThirtyOneScene' });
        this.playerCardHand = null;
    }

    preload() {
        super.preload();
        Cards.preload(this);
    }

    create() {
        super.create();
        console.log('thirty one create ran');
        this.playerCardHand = new ThirtyOneCardHand(this);
        this.counter = 0;
        this.playerCardHand.create();
    }

    update(time: number, delta: number) {
        console.log('thirty one update ran', this.counter++)
        this.playerCardHand?.update(time, delta);
    }

    // on scene end
    shutdown() {
        super.shutdown();
        console.log('thirtyOnescene shutdown');
        this.playerCardHand = null;
    }
}
