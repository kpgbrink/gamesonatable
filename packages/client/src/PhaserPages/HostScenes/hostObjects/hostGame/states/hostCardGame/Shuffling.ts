import { DegreesToRadians, getScreenCenter, randomFloatBetween } from "../../../../../objects/Tools";
import { HostCardGame } from "../../HostCardGame";
import { HostGameState } from "../HostGameState";
import { Dealing } from "./Dealing";


export class Shuffling extends HostGameState {
    hostGame: HostCardGame;
    randomStartingOffset: number = 300;
    randomStartingMovementSpeed: number = 3;
    randomStartingRotationalVelocity: number = DegreesToRadians(2);
    shufflingTime: number = 60 * 4;

    constructor(hostGame: HostCardGame) {
        super(hostGame);
        this.hostGame = hostGame;
    }

    enter() {
        // set the card movement to randomness
        const screenCenter = getScreenCenter(this.hostGame.scene);

        // set random card movement
        this.hostGame.cards.cardContainers.forEach(cardContainer => {
            // set random card offset
            cardContainer.x = screenCenter.x + randomFloatBetween(-this.randomStartingOffset, this.randomStartingOffset);
            cardContainer.y = screenCenter.y + randomFloatBetween(-this.randomStartingOffset, this.randomStartingOffset);

            // set random velocity
            const x = randomFloatBetween(-this.randomStartingMovementSpeed, this.randomStartingMovementSpeed);
            const y = randomFloatBetween(-this.randomStartingMovementSpeed, this.randomStartingMovementSpeed);
            cardContainer.velocity = { x, y };

            // set random rotational velocity
            cardContainer.rotationalVelocity = randomFloatBetween(-this.randomStartingRotationalVelocity, this.randomStartingRotationalVelocity);
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
            cardContainer.rotationalVelocity = 0;
        });
    }
}