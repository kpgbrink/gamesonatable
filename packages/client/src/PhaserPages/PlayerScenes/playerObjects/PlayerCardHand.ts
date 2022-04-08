import { Cards } from "../../objects/Cards";



export class PlayerCardHand {
    cards: Cards;

    constructor(scene: Phaser.Scene) {
        this.cards = new Cards(scene);
    }

    create() {
        this.cards.create(100, 100);
    }

    update(time: number, delta: number) {
        this.cards.update(time, delta);
    }
}