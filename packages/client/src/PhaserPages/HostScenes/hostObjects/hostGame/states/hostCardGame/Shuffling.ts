import { randomNumberBetween } from "../../../../../objects/Tools";
import { HostCardGame } from "../../HostCardGame";
import { HostGameState } from "../HostGameState";
import { Dealing } from "./Dealing";


export class Shuffling extends HostGameState {
    hostGame: HostCardGame;
    randomStartingMovementSpeed: number = 10;
    shufflingTime: number = 60 * 4;

    constructor(hostGame: HostCardGame) {
        super(hostGame);
        this.hostGame = hostGame;
    }

    enter() {
        // set the card movement to randomness
        this.hostGame.cards.cardContainers.forEach(cardContainer => {
            const x = randomNumberBetween(-this.randomStartingMovementSpeed, this.randomStartingMovementSpeed);
            const y = randomNumberBetween(-this.randomStartingMovementSpeed, this.randomStartingMovementSpeed);
            cardContainer.velocity = { x, y };
        });
    }

    update(): HostGameState | null {
        // shuffle then switch to deal state
        this.shufflingTime--;
        this.hostGame.cards.update();
        if (this.shufflingTime <= 0) {
            return new Dealing(this.hostGame);
        }
        return null;
    }

    exit() {
        // on exit
        this.hostGame.cards.cardContainers.forEach(cardContainer => {
            cardContainer.velocity = { x: 0, y: 0 };
        });
    }
}