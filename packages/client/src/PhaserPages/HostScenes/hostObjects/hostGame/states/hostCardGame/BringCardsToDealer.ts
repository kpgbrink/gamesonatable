import { positionAndRotationRelativeToObject } from "../../../../../objects/Tools";
import { HostCardGame } from "../../HostCardGame";
import { HostGameState } from "../HostGameState";


// Bring cards to the random dealer and have the cards start going out to people.
export class BringCardsToDealer extends HostGameState {
    hostGame: HostCardGame;
    getReadyToDealTime: number = .2;

    constructor(hostGame: HostCardGame) {
        super(hostGame);
        this.hostGame = hostGame;
    }

    enter() {
        // choose a random dealer
        this.hostGame.randomizeDealer();
        // start moving cards to random dealer
        this.startMovingCardsToDealer();
    }

    startMovingCardsToDealer() {
        this.hostGame.cards.cardContainers.forEach(cardContainer => {
            cardContainer.setStartPositionAsCurentPosition();
        });
        const dealer = this.hostGame.getDealer();
        const positionRotation = positionAndRotationRelativeToObject(dealer, { x: 0, y: 150, rotation: 0 });
        this.hostGame.cards.cardContainers.forEach(cardContainer => {
            cardContainer.startMovingCardTo(positionRotation, this.getReadyToDealTime);
        });

    }

    update(time: number, delta: number): HostGameState | null {
        this.hostGame.cards.update(time, delta);
        return null;
    }

    exit() {
    }
}