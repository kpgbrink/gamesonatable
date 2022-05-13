import { CardContent } from "api";
import socket from "../../../../SocketConnection";
import MenuButton from "../../../objects/MenuButton";
import { getScreenDimensions } from "../../../objects/Tools";
import { PlayerCardHand } from "../PlayerCardHand";


export class ThirtyOneCardHand extends PlayerCardHand {
    knockButton: MenuButton | null = null;
    knockPlayerId: string | null = null;

    create() {
        super.create();
        socket.on('thirty one player turn', (currentPlayerTurnId: string, shownCard: CardContent, hiddenCard: CardContent, turn: number, knockPlayerId: string | null) => {
            // set the cards to show the player to choose it's cards
            this.knockPlayerId = knockPlayerId;
            this.setCardToPickUp(shownCard, true, 2);
            this.setCardToPickUp(hiddenCard, false, 1);
            this.setAllowedPickUpCardAmount(1);
        });

        const screenDimensions = getScreenDimensions(this.scene);
        this.knockButton = new MenuButton(screenDimensions.width - 200, screenDimensions.height - 80, this.scene);
        this.knockButton.setInteractive();
        this.knockButton.setText('Knock');
        this.knockButton.on('pointerdown', () => {
            this.knockPlayerId = socket.id;
            socket.emit('thirty one knock');
            this.setAllowedPickUpCardAmount(0);
        });
        this.knockButton.setVisible(false);
        this.scene.add.existing(this.knockButton);
    }

    setAllowedPickUpCardAmount(amount: number): void {
        super.setAllowedPickUpCardAmount(amount);
        this.knockButton?.setVisible(amount !== 0 && this.knockPlayerId === null);
    }

    onAllCardsPickedUp(): void {
        // set 1 card to be able to put down.
        if (this.knockPlayerId === socket.id) return; // prevent picking up if you knocked.
        this.allowedDropCardAmount = 1;
    }

}