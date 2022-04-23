import { CardContent } from "api";
import socket from "../../../SocketConnection";
import { PlayerCardHand } from "./PlayerCardHand";
import PlayerScene from "./PlayerScene";


export class ThirtyOneCardHand extends PlayerCardHand {
    constructor(scene: PlayerScene) {
        super(scene);
    }

    create() {
        super.create();
        socket.on('thirty one player turn', (currentPlayerTurnId: string, shownCard: CardContent, hiddenCard: CardContent, turn: number) => {
            // set the cards to show the player to choose it's cards
            console.log('thirty one player turn', currentPlayerTurnId, shownCard, hiddenCard, turn);
            this.setCardToPickUp(shownCard, true, 2);
            this.setCardToPickUp(hiddenCard, false, 1);
            this.setAllowedPickUpCardAmount(1);
        });
    }

    onAllCardsPickedUp(): void {
        // set 1 card to be able to put down.
        console.log('set 1 drop card amount');
        this.allowedDropCardAmount = 1;
    }

}