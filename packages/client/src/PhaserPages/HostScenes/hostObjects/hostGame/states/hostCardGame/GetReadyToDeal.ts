import { positionAndRotationRelativeToObject } from "../../../../../objects/Tools";
import { HostCardGame } from "../../HostCardGame";
import { HostGameState } from "../HostGameState";


// Bring cards to the random dealer and have the cards start going out to people.
export class GetReadyToDeal extends HostGameState {
    hostGame: HostCardGame;
    getReadyToDealTime: number = .5;

    constructor(hostGame: HostCardGame) {
        super(hostGame);
        this.hostGame = hostGame;
    }

    enter() {
        // choose a random dealer
        this.hostGame.randomizeDealer();
        console.log(this.hostGame.currentDealerId);
        // move the cards to the random dealer\
        this.moveCardsToDealer();
    }

    moveCardsToDealer() {
        // for not just instantly move the cards to the dealer
        // but have them move to the dealer over time
        const dealer = this.hostGame.getDealer();
        const positionRotation = positionAndRotationRelativeToObject(dealer, { x: 0, y: 100, rotation: 0 });
        this.hostGame.cards.cardContainers.forEach(cardContainer => {
            cardContainer.setPosition(positionRotation.x, positionRotation.y);
            cardContainer.setRotation(positionRotation.rotation);
        });
    }

    update(time: number, delta: number): HostGameState | null {
        return null;
    }

    exit() {
    }
}