import socket from "../../../../../../SocketConnection";
import { getScreenCenter } from "../../../../../objects/Tools";
import { HostCardGame } from "../../HostCardGame";
import { HostGameState } from "../HostGameState";
import { Shuffling } from "./Shuffling";

export class StartGettingReadyToShuffle extends HostGameState {
    hostGame: HostCardGame;
    // store the countdown timer for the movement of the card and the card that is moving
    sendingOutCardTime: number = .7;

    constructor(hostGame: HostCardGame) {
        super(hostGame);
        this.hostGame = hostGame;
    }

    enter() {
        const screenCenter = getScreenCenter(this.hostGame.scene);
        this.hostGame.cardInHandTransform.setToDefault();
        this.hostGame.cards.cardContainers.forEach(cardContainer => {
            // tell user to move the card to the table
            socket.emit('moveCardToTable', cardContainer.cardContent, cardContainer.userHandId);
            // remove all cards from the player hand
            cardContainer.userHandId = null;
            // set all cards face down
            cardContainer.setFaceUp(false);
            // remove tint from all cards
            cardContainer.frontImage?.setTint(0xffffff);
            // remove the special transform on the card
            cardContainer.cardInHandOffsetTransform.setToDefault();
            // start moving all of the cards to the center
            cardContainer.startMovingOverTimeTo({ x: screenCenter.x, y: screenCenter.y, rotation: 0, scale: 1 }, this.sendingOutCardTime);
        });
        socket.emit('starting to shuffle');
    }

    update(time: number, delta: number): HostGameState | null {
        this.hostGame.cards.update(time, delta);
        // once all cards are done moving, start the next round
        if (this.hostGame.cards.cardContainers.every(cardContainer => cardContainer.moveOnDuration === null)) {
            this.hostGame.changeState(new Shuffling(this.hostGame));
        }
        return null;
    }

    exit() {
        // on exit
    }
}