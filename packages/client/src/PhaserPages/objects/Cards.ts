import CardContainer from "./CardContainer";

export const suites = ['hearts', 'diamonds', 'spades', 'clubs'];
export const cards = ['Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King'];

export class Cards {
    cardContainers: CardContainer[] = [];
    scene: Phaser.Scene;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.cardContainers = [];
    }

    public static preload(scene: Phaser.Scene) {
        scene.load.atlas('cards', 'assets/cards/cards.png', 'assets/cards/cards.json');
    }

    // default cards to create. the whole deck excluding jokers
    create(x: number, y: number) {
        // create the cards
        for (let suite of suites) {
            for (let card of cards) {
                const cardContainer = new CardContainer(this.scene, x, y, suite, card);
                this.cardContainers.push(cardContainer);
                this.scene.add.existing(cardContainer);
            }
        }
    }

    setDepth(depth: number) {
        this.cardContainers.forEach(cardContainer => cardContainer.setDepth(depth));
    }

    update(time: number, delta: number) {
        this.cardContainers.forEach(cardContainer => cardContainer.update(time, delta));
    }
}