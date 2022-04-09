import { CardContent } from "api";
import socket from "../../../SocketConnection";
import { Cards } from "../../objects/Cards";

export class PlayerCardHand {
    cards: Cards;

    cardsInHand() {
        const userId = socket.id;
        return this.cards.getPlayerCards(userId);
    }

    constructor(scene: Phaser.Scene) {
        this.cards = new Cards(scene);
    }

    create() {
        this.cards.create(100, 100);

        // add socket listeners
        socket.on('give card', (userId: string, cardContent: CardContent) => {
            // get the card that has to be given to player
            const card = this.cards.getCard(cardContent);
            if (!card) throw new Error('card not found');
            // add the card to the player's hand
            card.inUserHandId = userId;

        });
    }

    update(time: number, delta: number) {
        this.cards.update(time, delta);
    }
}