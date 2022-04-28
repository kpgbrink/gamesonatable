import { ThirtyOneGame } from "../../../ThirtyOneGame";
import { HostGameState } from "../../HostGameState";

// Bring cards to the random dealer and have the cards start going out to people.
export class ThirtyOneRoundEnd extends HostGameState {
    hostGame: ThirtyOneGame;
    bringShownCardToPositionTime: number = 1;

    constructor(hostGame: ThirtyOneGame) {
        super(hostGame);
        this.hostGame = hostGame;
    }

    enter() {
        // display the player's cards and their scores.
        console.log('show the scores of the player cards');
    }

    update(time: number, delta: number): HostGameState | null {
        this.hostGame.cards.update(time, delta);
        return null;
    }

    exit() {
    }
}