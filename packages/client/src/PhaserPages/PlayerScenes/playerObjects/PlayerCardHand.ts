import { CardContent } from "api";
import socket from "../../../SocketConnection";
import CardContainer from "../../objects/CardContainer";
import { Cards } from "../../objects/Cards";
import { getScreenCenter } from "../../objects/Tools";
import PlayerScene from "./PlayerScene";

export class PlayerCardHand {
    cards: Cards;
    scene: PlayerScene;

    constructor(scene: PlayerScene) {
        this.scene = scene;
        this.cards = new Cards(scene);
    }

    cardsInHand() {
        const userId = socket.id;
        return this.cards.getPlayerCards(userId);
    }

    create() {
        const screenCenter = getScreenCenter(this.scene);
        this.cards.create(screenCenter.x, 100);
        this.cards.cardContainers.forEach(card => {
            card.y += 100;

        });

        // add socket listeners
        socket.on('give card', (cardContent: CardContent) => {
            this.cards.cardContainers.forEach(card => {
                card.y += 100;

            });

            // get the card that has to be given to player
            const card = this.cards.getCard(cardContent);
            if (!card) throw new Error('card not found');
            card.x += 100;
            // move the card to the player
            card.inUserHandId = socket.id;
            // move the card to the player hand
            this.moveCardToPlayerHand(card);
        });
    }

    moveCardToPlayerHand(card: CardContainer) {
        // screen center
        const screenCenter = getScreenCenter(this.scene);
        // start moving this card
        card.startMovingOverTimeTo({
            x: screenCenter.x, y: screenCenter.y, rotation: 0
        }, 4);
        card.setCardFaceUp(true);
    }

    update(time: number, delta: number) {
        this.cards.update(time, delta);
    }
}