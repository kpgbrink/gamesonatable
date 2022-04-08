import { CountdownTimer } from "../../../../../objects/CountdownTimer";
import { calculateMovementFromTimer, positionAndRotationRelativeToObject } from "../../../../../objects/Tools";
import { HostCardGame } from "../../HostCardGame";
import { HostGameState } from "../HostGameState";
import { Dealing } from "./Dealing";


// Bring cards to the random dealer and have the cards start going out to people.
export class BringCardsToDealer extends HostGameState {
    hostGame: HostCardGame;
    getReadyToDealTime: number = .5;
    moveCardToDealerTimer: CountdownTimer = new CountdownTimer(.5);

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
    }

    moveCardsToDealer(delta: number) {
        // for not just instantly move the cards to the dealer
        // but have them move to the dealer over time
        const dealer = this.hostGame.getDealer();

        const positionRotation = positionAndRotationRelativeToObject(dealer, { x: 0, y: 150, rotation: 0 });


        this.moveCardToDealerTimer.update(delta);
        if (this.moveCardToDealerTimer.wasDone()) {
            return;
        }
        this.hostGame.cards.cardContainers.forEach(cardContainer => {
            // cardContainer.setPosition(positionRotation.x, positionRotation.y);
            // cardContainer.setRotation(positionRotation.rotation);
            const movement = calculateMovementFromTimer(this.moveCardToDealerTimer, delta, cardContainer, positionRotation);
            cardContainer.x += movement.x;
            cardContainer.y += movement.y;
            cardContainer.rotation += movement.rotation;
        });
    }

    update(time: number, delta: number): HostGameState | null {
        this.moveCardsToDealer(delta);
        if (this.moveCardToDealerTimer.wasDone()) {
            return new Dealing(this.hostGame);
        }
        return null;
    }

    exit() {
    }
}