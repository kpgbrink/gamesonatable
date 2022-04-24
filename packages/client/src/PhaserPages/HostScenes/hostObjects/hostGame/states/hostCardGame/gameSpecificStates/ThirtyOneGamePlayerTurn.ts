import socket from "../../../../../../../SocketConnection";
import { ThirtyOneGame } from "../../../ThirtyOneGame";
import { HostGameState } from "../../HostGameState";

// Bring cards to the random dealer and have the cards start going out to people.
export class ThirtyOneGamePlayerTurn extends HostGameState {
    hostGame: ThirtyOneGame;
    bringShownCardToPositionTime: number = 1;

    constructor(hostGame: ThirtyOneGame) {
        super(hostGame);
        this.hostGame = hostGame;
    }

    enter() {
        // make the player to left of dealer start their turn
        this.hostGame.setNextPlayerTurn();
        // tell the player that it is their turn
        const hiddenCard = this.hostGame.cards.getTopFaceDownCard();
        const shownCard = this.hostGame.cards.getTopFaceUpCard();
        if (!shownCard) {
            throw new Error("No shown card found");
        }
        if (!hiddenCard) {
            throw new Error("No hidden card found");
        }

        socket.emit("thirty one player turn", this.hostGame.currentPlayerTurnId, shownCard.cardContent, hiddenCard.cardContent, this.hostGame.turn);
    }

    update(time: number, delta: number): HostGameState | null {
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