import { CountdownTimer } from "../../../../../objects/CountdownTimer";
import { DegreesToRadians, positionAndRotationRelativeToObject } from "../../../../../objects/Tools";
import { HostCardGame } from "../../HostCardGame";
import { HostGameState } from "../HostGameState";

export class Dealing extends HostGameState {
    hostGame: HostCardGame;
    // store the countdown timer for the movement of the card and the card that is moving
    nextCardTimer: CountdownTimer = new CountdownTimer(.1);
    sendingOutCardTime: number = .7;

    currentPlayerGettingCard: string | null = null;

    constructor(hostGame: HostCardGame) {
        super(hostGame);
        this.hostGame = hostGame;
    }

    enter() {
        // set the cards in the center of the table
    }

    getNextCardDeal(delta: number) {
        // get the next card to deal
        this.nextCardTimer.update(delta);
        if (this.nextCardTimer.wasDone()) {
            this.sendOutCard();
            this.nextCardTimer.start();
            return;
        }
    }

    sendOutCard() {
        // get the player that the card is going to
        if (this.hostGame.currentDealerId === null) {
            throw new Error('currentDealerId is null');
        }
        this.currentPlayerGettingCard ??= this.hostGame.currentDealerId;
        this.currentPlayerGettingCard = this.hostGame.getNextPlayerId(this.currentPlayerGettingCard);

        // check count of cards dealt to player.
        if (this.hostGame.getPlayerCards(this.currentPlayerGettingCard).length >= this.hostGame.dealAmount) {
            return;
        }

        // get top card container that is not set to a player yet
        const cardContainer = this.hostGame.cards.cardContainers.reverse().find(cardContainer => cardContainer.inUserHandId === null);
        if (!cardContainer) {
            return;
        }
        cardContainer.inUserHandId = this.currentPlayerGettingCard;

        // get the player that the card is going to
        const userContainer = this.hostGame.getUser(this.currentPlayerGettingCard);
        if (!userContainer) {
            throw new Error('user is null');
        }

        const positionRotation = positionAndRotationRelativeToObject(userContainer, { x: 0, y: 350, rotation: DegreesToRadians(180) });

        cardContainer.startMovingCardTo(positionRotation, this.sendingOutCardTime);

    }

    update(time: number, delta: number): HostGameState | null {
        // deal the cards then switch to player turn state
        this.getNextCardDeal(delta);
        this.hostGame.cards.update(time, delta);
        return null;
    }

    exit() {
        // on exit
    }
}