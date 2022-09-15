import { ThirtyOneCardGameData, ThirtyOnePlayerCardHandData } from "api/src/data/datas/cardHandDatas/ThirtyOneCardHandData";
import socket from "../../../../SocketConnection";
import CardContainer from "../../../objects/items/CardContainer";
import MenuButton from "../../../objects/MenuButton";
import { persistentData } from "../../../objects/PersistantData";
import { getScreenDimensions } from "../../../objects/Tools";
import { PlayerCardHand } from "../PlayerCardHand";
import PlayerScene from "../PlayerScene";


export class ThirtyOneCardHand extends PlayerCardHand<ThirtyOnePlayerCardHandData, ThirtyOneCardGameData> {
    playerData: ThirtyOnePlayerCardHandData;
    gameData: ThirtyOneCardGameData;

    constructor(scene: PlayerScene) {
        super(scene);
        this.playerData = new ThirtyOnePlayerCardHandData();
        this.gameData = new ThirtyOneCardGameData();
    }

    // ------------------------------------ Data ------------------------------------
    override getPlayerDataToSend(): Partial<ThirtyOnePlayerCardHandData> | undefined {
        super.getPlayerDataToSend();
        return this.playerData;
    }

    override onPlayerDataReceived(playerData: Partial<ThirtyOnePlayerCardHandData>, gameData: Partial<ThirtyOneCardGameData> | null): void {
        super.onPlayerDataReceived(playerData, gameData);
        // check if can knock
        if (this.gameData?.knockPlayerId === null && this.playerData.cardIds.length === 3) {
            this.knockButton?.setVisible(true);
        } else {
            this.knockButton?.setVisible(false);
        }
        this.playerData = { ...this.playerData, ...playerData };
    }

    override getGameDataToSend(): Partial<ThirtyOneCardGameData> | undefined {
        const gameData = super.getGameDataToSend();
        return gameData;
    }
    override onGameDataReceived(gameData: Partial<ThirtyOneCardGameData>): void {
        super.onGameDataReceived(gameData);
        this.gameData = { ...this.gameData, ...gameData };
    }
    // ------------------------------------ Data End ------------------------------------

    listenForState: string = "playerDataToUser";

    knockButton: MenuButton | null = null;

    create() {
        super.create();

        const screenDimensions = getScreenDimensions(this.scene);
        this.knockButton = new MenuButton(screenDimensions.width - 200, screenDimensions.height - 80, this.scene);
        this.knockButton.setInteractive();
        this.knockButton.setText('Knock');
        this.knockButton.on('pointerdown', () => {
            this.gameData.knockPlayerId = persistentData.myUserId;
            socket.emit('thirty one knock');
            this.setAllowedPickUpCardAmount(0);
            this.sendData(true);
        });
        this.knockButton.setVisible(false);
        this.scene.add.existing(this.knockButton);
    }

    setAllowedPickUpCardAmount(amount: number): void {
        super.setAllowedPickUpCardAmount(amount);
        this.knockButton?.setVisible(amount !== 0 && this.gameData.knockPlayerId === null);
    }

    onAllCardsPickedUp(): void {
        // set 1 card to be able to put down.
        if (this.gameData.knockPlayerId === persistentData.myUserId) return; // prevent picking up if you knocked.
        this.updateAllowedDropCardAmount(this.playerData);
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
}