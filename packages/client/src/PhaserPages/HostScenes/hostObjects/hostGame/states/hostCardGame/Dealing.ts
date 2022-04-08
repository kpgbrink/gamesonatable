import socket from "../../../../../../SocketConnection";
import CardContainer from "../../../../../objects/CardContainer";
import { CountdownTimer } from "../../../../../objects/CountdownTimer";
import { calculateMovementFromTimer, DegreesToRadians, positionAndRotationRelativeToObject } from "../../../../../objects/Tools";
import UserAvatarContainer from "../../../../../objects/UserAvatarContainer";
import { HostCardGame } from "../../HostCardGame";
import { HostGameState } from "../HostGameState";

interface ISendingOutCard {
    cardContainer: CardContainer
    userContainer: UserAvatarContainer
    countdownTimer: CountdownTimer;
}

export class Dealing extends HostGameState {
    hostGame: HostCardGame;
    // store the countdown timer for the movement of the card and the card that is moving
    nextCardTimer: CountdownTimer = new CountdownTimer(.1);
    sendingOutCards: ISendingOutCard[] = [];
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
        // send out the next card
        // if there are no cards left to deal then switch to player turn state  
        // get the top player card

        // get the player that the card is going to
        if (this.hostGame.currentDealerId === null) {
            throw new Error('currentDealerId is null');
        }
        this.currentPlayerGettingCard ??= this.hostGame.currentDealerId;
        this.currentPlayerGettingCard = this.hostGame.getNextPlayerId(this.currentPlayerGettingCard);

        // check count of cards dealt to player. if they are at max then switch to player turn state
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

        cardContainer.setStartPositionAsCurentPosition();
        // add the player getting the card to the list of players getting cards
        this.sendingOutCards.push({
            cardContainer,
            userContainer,
            countdownTimer: new CountdownTimer(this.sendingOutCardTime)
        });
    }

    updateSendingOutCards(delta: number) {
        // update the cards that are being sent out
        this.sendingOutCards.forEach(sendingOutCard => {
            sendingOutCard.countdownTimer.update(delta);
            // move the card to the user
            const positionRotation = positionAndRotationRelativeToObject(sendingOutCard.userContainer, { x: 0, y: 350, rotation: DegreesToRadians(180) });
            const movement = calculateMovementFromTimer(sendingOutCard.countdownTimer, delta, sendingOutCard.cardContainer, positionRotation);
            sendingOutCard.cardContainer.x += movement.x;
            sendingOutCard.cardContainer.y += movement.y;
            sendingOutCard.cardContainer.rotation += movement.rotation;

            // if the card is done moving then remove it from the list
            if (sendingOutCard.countdownTimer.wasDone()) {
                // todo gived the card to the player
                console.log('trying to give card', sendingOutCard.userContainer.user.id, sendingOutCard.cardContainer.cardContent);
                socket.emit('give card', sendingOutCard.userContainer.user.id, sendingOutCard.cardContainer.cardContent);
                this.sendingOutCards.splice(this.sendingOutCards.indexOf(sendingOutCard), 1);
            }
        });
    }

    update(time: number, delta: number): HostGameState | null {
        // deal the cards then switch to player turn state
        this.getNextCardDeal(delta);
        this.updateSendingOutCards(delta);
        return null;
    }

    exit() {
        // on exit
    }
}