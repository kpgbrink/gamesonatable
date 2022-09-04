import { ThirtyOnePlayerCardHandData } from "api/src/data/datas/cardHandDatas/ThirtyOneCardHandData";
import socket from "../../../../SocketConnection";
import CardContainer from "../../../objects/items/CardContainer";
import MenuButton from "../../../objects/MenuButton";
import { persistentData } from "../../../objects/PersistantData";
import { getScreenDimensions } from "../../../objects/Tools";
import { PlayerCardHand } from "../PlayerCardHand";


export class ThirtyOneCardHand extends PlayerCardHand<ThirtyOnePlayerCardHandData> {
    listenForState: string = "playerDataToUser";

    knockButton: MenuButton | null = null;
    knockPlayerId: string | null = null;

    create() {
        super.create();
        socket.on('thirty one player turn', (currentPlayerTurnId: string, shownCard: number, hiddenCard: number, turn: number, knockPlayerId: string | null) => {
            console.log('thirty on player turn socket on');
            // set the cards to show the player to choose it's cards
            this.knockPlayerId = knockPlayerId;
            // if I only have 3 cards in my hand
            if (this.cardsInHand().length === 3) {
                this.setCardToPickUp(shownCard, true, 2);
                this.setCardToPickUp(hiddenCard, false, 1);
                this.setAllowedPickUpCardAmount(1);
            } else {
                this.onAllCardsPickedUp();
            }
        });

        const screenDimensions = getScreenDimensions(this.scene);
        this.knockButton = new MenuButton(screenDimensions.width - 200, screenDimensions.height - 80, this.scene);
        this.knockButton.setInteractive();
        this.knockButton.setText('Knock');
        this.knockButton.on('pointerdown', () => {
            this.knockPlayerId = persistentData.myUserId;
            socket.emit('thirty one knock');
            this.setAllowedPickUpCardAmount(0);
        });
        this.knockButton.setVisible(false);
        this.scene.add.existing(this.knockButton);
    }

    override updatePlayerData(playerData: ThirtyOnePlayerCardHandData): void {

    }

    setAllowedPickUpCardAmount(amount: number): void {
        super.setAllowedPickUpCardAmount(amount);
        this.knockButton?.setVisible(amount !== 0 && this.knockPlayerId === null);
    }

    onAllCardsPickedUp(): void {
        // set 1 card to be able to put down.
        if (this.knockPlayerId === persistentData.myUserId) return; // prevent picking up if you knocked.
        this.allowedDropCardAmount = 1;
    }

    checkIfMoveCardToTable(card: CardContainer) {
        if (card.beforeDraggedTransform === null) return;
        if (card.y > card.beforeDraggedTransform?.y) return;
        if (card.cardBackOnTable) return;
        if (!card.userHandId) return;
        if (this.allowedDropCardAmount <= 0) return;
        // tell host to move the card to the table
        this.allowedDropCardAmount -= 1;
        this.putCardBackOnTable(card);
        // check if you have 31 now and there if there is no tonk player then you do 31 and round ends.
        const cardsInHand = this.cardsInHand();
        if (cardsInHand.length !== 3) {
            throw new Error('cards in hand is not 3');

        }
        socket.emit('moveCardToTable', card.id);
    }

    onUpdateCardHandState(thirtyOneCardHandState: ThirtyOnePlayerCardHandData) {
        super.onUpdateCardHandState(thirtyOneCardHandState);
        this.knockButton?.setVisible(thirtyOneCardHandState.canKnock && this.knockPlayerId === null);
    }
}