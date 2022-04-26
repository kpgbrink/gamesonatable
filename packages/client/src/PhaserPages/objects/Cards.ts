import { CardContent } from "api";
import CardContainer from "./CardContainer";
import { shuffle } from "./Tools";

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

    shuffle() {
        shuffle(this.cardContainers);
        this.cardContainers.forEach((cardContainer, i) => {
            cardContainer.setDepth(i);
        });
    }

    update(time: number, delta: number) {
        this.cardContainers.forEach(cardContainer => cardContainer.update(time, delta));
    }

    getPlayerCards(playerId: string) {
        return this.cardContainers.filter(cardContainer => cardContainer.userHandId === playerId);
    }

    isEqual(card1: CardContent, card2: CardContent) {
        if (!card1 || !card2) return false;
        return 1
            && card1.suit === card2.suit
            && card1.card === card2.card
            && card1.joker === card2.joker;
    }


    getCard(cardContent: CardContent) {
        return this.cardContainers.find(cardContainer => {
            return this.isEqual(cardContainer.cardContent, cardContent)
        });
    }

    getTableCards() {
        return this.cardContainers.filter(cardContainer => cardContainer.userHandId === null);
    }

    getTableTopCard() {
        return this.cardContainers.reverse().find(cardContainer => cardContainer.userHandId === null)
    }

    getTableCardsSortedByDepth() {
        return this.getTableCards().sort((c1, c2) => c2.depth - c1.depth);
    }

    getTopFaceDownCard() {
        const faceUpCards = this.getTableCardsSortedByDepth().filter(cardContainer => !cardContainer.getFaceUp());
        return faceUpCards.length > 0 ? faceUpCards[0] : null;
    }

    getTopFaceUpCard() {
        const faceUpCards = this.getTableCardsSortedByDepth().filter(cardContainer => cardContainer.getFaceUp());
        return faceUpCards.length > 0 ? faceUpCards[0] : null;
    }

    getDraggedCard() {
        return this.cardContainers.find(cardContainer => cardContainer.isDragging);
    }

    cardsInDeck() {
        return this.cardContainers.filter(cardContainer => cardContainer.cardBackOnTable);
    }
}