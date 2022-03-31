import CardContainer, { cards, suites } from "./CardContainer";


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

    update() {
        this.cardContainers.forEach(cardContainer => cardContainer.update());
    }
}