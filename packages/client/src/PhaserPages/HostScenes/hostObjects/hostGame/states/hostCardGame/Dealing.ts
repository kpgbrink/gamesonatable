import socket from "../../../../../../SocketConnection";
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
        const cardContainer = this.hostGame.cards.getTableTopCard();
        if (!cardContainer) {
            return;
        }
        cardContainer.inUserHandId = this.currentPlayerGettingCard;

        // get the player that the card is going to
        const userContainer = this.hostGame.getUser(this.currentPlayerGettingCard);
        if (!userContainer) {
            throw new Error('user is null');
        }

        const positionRotation = positionAndRotationRelativeToObject(userContainer, { x: 0, y: 500, rotation: DegreesToRadians(180) });

        cardContainer.startMovingOverTimeTo(positionRotation, this.sendingOutCardTime, () => {
            // when the card is done moving, set the card to the player
            socket.emit('give card', cardContainer.inUserHandId, cardContainer.cardContent);
        });
    }

    update(time: number, delta: number): HostGameState | null {
        this.getNextCardDeal(delta);
        this.hostGame.cards.update(time, delta);
        // check if every player has the amount of cards they need
        if (this.hostGame.hostUserAvatars?.userAvatarContainers?.every(userAvatar =>
            this.hostGame.getPlayerCards(userAvatar.user.id)?.length === this.hostGame.dealAmount)) {
            return new this.hostGame.gameStartStateConstructor(this.hostGame);
        }
        return null;
    }

    exit() {
        // on exit
    }
}