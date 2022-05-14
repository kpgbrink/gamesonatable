import { transformFromObject } from "../../../../../objects/Tools";
import { HostCardGame } from "../../HostCardGame";
import { HostGameState } from "../HostGameState";
import { Dealing } from "./Dealing";


// Bring cards to the random dealer and have the cards start going out to people.
export class BringCardsToDealer extends HostGameState {
    hostGame: HostCardGame;
    getReadyToDealTime: number = .2;

    constructor(hostGame: HostCardGame) {
        super(hostGame);
        this.hostGame = hostGame;
    }

    enter() {
        this.hostGame.setNextDealer();
        // start moving cards to random dealer
        this.startMovingCardsToDealer();
    }

    startMovingCardsToDealer() {
        const dealer = this.hostGame.getDealer();
        const positionRotation = transformFromObject(dealer, { x: 0, y: 150, rotation: 0, scale: 1 });
        this.hostGame.cards.cardContainers.forEach(cardContainer => {
            cardContainer.startMovingOverTimeTo(positionRotation, this.getReadyToDealTime);
        });
    }

    update(time: number, delta: number): HostGameState | null {
        this.hostGame.cards.update(time, delta);
        // check if all cards are in the dealer
        if (this.hostGame.cards.cardContainers.every(cardContainer =>
            cardContainer.moveOnDuration === null
        )) {
            return new Dealing(this.hostGame);
        }
        return null;
    }

    exit() {
    }
}