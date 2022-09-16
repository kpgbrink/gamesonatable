import { ThirtyOneCardGameData, ThirtyOnePlayerCardHandData } from "api/src/data/datas/cardHandDatas/ThirtyOneCardHandData";
import { ThirtyOneGame } from "../../../ThirtyOneGame";
import { HostGameState } from "../../HostGameState";

// Bring cards to the random dealer and have the cards start going out to people.
export class ThirtyOneGamePlayerTurn extends HostGameState<ThirtyOnePlayerCardHandData, ThirtyOneCardGameData> {
    hostGame: ThirtyOneGame;
    bringShownCardToPositionTime: number = 1;

    constructor(hostGame: ThirtyOneGame) {
        super(hostGame);
        this.hostGame = hostGame;
    }

    override getPlayerDataToSend(userId: string): Partial<ThirtyOnePlayerCardHandData> | undefined {
        const thirtyOnePlayerCardHandData: Partial<ThirtyOnePlayerCardHandData> = {};

        // check if it is the user's turn
        const isUserTurn = this.hostGame.gameData.playerTurnId === userId;
        if (isUserTurn) {
            // send the cards the user can pick up 
            const topFaceUpCard = this.hostGame.cards.getTopFaceUpCard();
            const topFaceDownCard = this.hostGame.cards.getTopFaceDownCard();
            if (topFaceUpCard && topFaceDownCard) {
                thirtyOnePlayerCardHandData.pickUpFaceUpCardIds = [topFaceUpCard.id];
                thirtyOnePlayerCardHandData.pickUpFaceDownCardIds = [topFaceDownCard.id];
            }
            thirtyOnePlayerCardHandData.pickUpTo = 4;
            thirtyOnePlayerCardHandData.dropTo = 3;
        } else {
            thirtyOnePlayerCardHandData.pickUpFaceUpCardIds = [];
            thirtyOnePlayerCardHandData.pickUpFaceDownCardIds = [];
            thirtyOnePlayerCardHandData.pickUpTo = null;
            thirtyOnePlayerCardHandData.dropTo = null;
        }


        return thirtyOnePlayerCardHandData;
    }

    enter() {
        // make the player to left of dealer start their turn
        this.hostGame.setNextPlayerTurn();
        this.hostGame.sendPlayerPickUpCards();
    }

    update(time: number, delta: number): HostGameState<ThirtyOnePlayerCardHandData, ThirtyOneCardGameData> | null {
        this.hostGame.cards.update(time, delta);
        // check if all cards are in the dealer
        return null;
    }

    onItemMoveToTable(): void {
        this.hostGame.changeState(new ThirtyOneGamePlayerTurn(this.hostGame));
    }

    exit() {
    }
}