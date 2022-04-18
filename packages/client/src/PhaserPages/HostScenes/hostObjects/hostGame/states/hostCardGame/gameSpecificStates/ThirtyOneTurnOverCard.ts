import { transformRelativeToScreenCenter } from "../../../../../../objects/Tools";
import { ThirtyOneGame } from "../../../ThirtyOneGame";
import { HostGameState } from "../../HostGameState";
import { ThirtyOneGamePlayerTurn } from "./ThirtyOneGamePlayerTurn";

// Bring cards to the random dealer and have the cards start going out to people.
export class ThirtyOneGameTurnOverCard extends HostGameState {
    hostGame: ThirtyOneGame;
    bringShownCardToPositionTime: number = 1;

    constructor(hostGame: ThirtyOneGame) {
        super(hostGame);
        this.hostGame = hostGame;
    }

    enter() {
        // start moving cards to random dealer
        this.startMovingCardsToCenter();
    }

    startMovingCardsToCenter() {
        const transform = { x: 100, y: 0, rotation: 0, scale: 1 };
        const newTransform = transformRelativeToScreenCenter(this.hostGame.scene, transform);
        // move cards to center.
        const cardContainer = this.hostGame.cards.getTableTopCard();
        if (!cardContainer) {
            throw new Error("No card container found");
        }
        cardContainer.startMovingOverTimeTo(newTransform, this.bringShownCardToPositionTime, () => {
            cardContainer.setCardFaceUp(true);
        });
    }

    update(time: number, delta: number): HostGameState | null {
        this.hostGame.cards.update(time, delta);
        // check if all cards are in the dealer
        if (this.hostGame.cards.cardContainers.every(cardContainer =>
            cardContainer.moveOnDuration === null
        )) {
            return new ThirtyOneGamePlayerTurn(this.hostGame);
        }
        return null;
    }

    exit() {
    }
}