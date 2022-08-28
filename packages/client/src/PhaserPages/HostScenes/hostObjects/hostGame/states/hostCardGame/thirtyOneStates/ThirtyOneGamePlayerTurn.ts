import { ThirtyOnePlayerCardHandState } from "api/src/playerState/playerStates/specificPlayerCardHandStates/ThirtyOnePlayerCardHandState";
import { ThirtyOneGame } from "../../../ThirtyOneGame";
import { HostGameState } from "../../HostGameState";

// Bring cards to the random dealer and have the cards start going out to people.
export class ThirtyOneGamePlayerTurn extends HostGameState<ThirtyOnePlayerCardHandState> {
    hostGame: ThirtyOneGame;
    bringShownCardToPositionTime: number = 1;

    constructor(hostGame: ThirtyOneGame) {
        super(hostGame);
        this.hostGame = hostGame;
    }

    enter() {
        // make the player to left of dealer start their turn
        this.hostGame.setNextPlayerTurn();
        this.hostGame.sendPlayerPickUpCards();
    }

    update(time: number, delta: number): HostGameState<ThirtyOnePlayerCardHandState> | null {
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