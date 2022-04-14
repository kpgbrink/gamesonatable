import { positionAndRotationRelativeToScreenCenter } from "../../../../../../objects/Tools";
import { ThirtyOneGame } from "../../../ThirtyOneGame";
import { HostGameState } from "../../HostGameState";
import { ThirtyOneGameTurnOverCard } from "./ThirtyOneTurnOverCard";

// Bring cards to the random dealer and have the cards start going out to people.
export class ThirtyOneGameStart extends HostGameState {
    hostGame: ThirtyOneGame;
    bringToCenterTime: number = 1;

    constructor(hostGame: ThirtyOneGame) {
        super(hostGame);
        this.hostGame = hostGame;
    }

    enter() {
        // start moving cards to random dealer
        this.startMovingCardsToCenter();
    }

    startMovingCardsToCenter() {
        const positionRotation = { x: -100, y: 0, rotation: 0 };
        const positionRotationRelativeScreenCenter = positionAndRotationRelativeToScreenCenter(this.hostGame.scene, positionRotation);
        // move cards to center.
        this.hostGame.cards.getTableCards().forEach(cardContainer => {
            cardContainer.startMovingOverTimeTo(positionRotationRelativeScreenCenter, this.bringToCenterTime);
        });
    }

    update(time: number, delta: number): HostGameState | null {
        this.hostGame.cards.update(time, delta);
        // check if all cards are in the dealer
        if (this.hostGame.cards.cardContainers.every(cardContainer =>
            cardContainer.moveOnDuration === null
        )) {
            return new ThirtyOneGameTurnOverCard(this.hostGame);
        }
        return null;
    }

    exit() {
    }
}