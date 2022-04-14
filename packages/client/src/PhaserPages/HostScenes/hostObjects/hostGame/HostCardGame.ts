import CardContainer from "../../../objects/CardContainer";
import { Cards } from "../../../objects/Cards";
import { getScreenCenter, positionAndRotationRelativeToObject as setPositionAndRotationRelativeToObject } from "../../../objects/Tools";
import UserAvatarContainer from "../../../objects/UserAvatarContainer";
import { HostGame } from "../HostGame";
import { HostUserAvatarsAroundTableGame } from "../HostUserAvatars/HostUserAvatarsAroundTable/HostUserAvatarsAroundTableGame";
import { Shuffling } from "./states/hostCardGame/Shuffling";
import { HostGameState } from "./states/HostGameState";

// construction of HostGameState interface
export interface HostGameStateConstructor {
    new(hostGame: HostCardGame): HostGameState;
}

export abstract class HostCardGame extends HostGame {
    scene: Phaser.Scene;
    cards: Cards;
    hostUserAvatars: HostUserAvatarsAroundTableGame | null = null;
    dealAmount: number = 10;
    currentDealerId: string | null = null;
    currentPlayerTurnId: string | null = null;
    turn: number = 0;

    abstract gameStartStateConstructor: HostGameStateConstructor;

    constructor(scene: Phaser.Scene) {
        super(scene);
        this.scene = scene;
        this.cards = new Cards(scene);
    }

    getDealer() {
        if (!this.currentDealerId) throw new Error('No dealer set');
        const dealer = this.hostUserAvatars?.getUserById(this.currentDealerId);
        if (!dealer) throw new Error('No dealer found');
        return dealer;
    }

    randomizeDealer() {
        // choose a random dealer
        this.currentDealerId = this.hostUserAvatars?.getRandomUserId() || null;
    }

    nextDealer() {
        if (!this.currentDealerId) {
            this.randomizeDealer();
            return;
        }
        this.currentDealerId = this.hostUserAvatars?.getNextUserIdFromRotation(this.currentDealerId) || null;
    }

    setNextPlayerTurn() {
        this.turn++;
        if (this.currentPlayerTurnId === null) {
            this.currentPlayerTurnId = this.getNextPlayerId(this.getDealer().user.id);
            return;
        }
        this.currentPlayerTurnId = this.getNextPlayerId(this.currentPlayerTurnId);
    }

    getNextPlayerId(playerId: string) {
        if (!this.hostUserAvatars) {
            throw new Error('Not made');
        }
        return this.hostUserAvatars.getNextUserIdFromRotation(playerId);
    }

    create() {
        super.create();
        this.hostUserAvatars = new HostUserAvatarsAroundTableGame(this.scene);
        this.hostUserAvatars.createOnRoomData();
        this.hostUserAvatars.moveToEdgeOfTable();
        const screenCenter = getScreenCenter(this.scene);
        this.cards.create(screenCenter.x, screenCenter.y);
        this.changeState(new Shuffling(this));
    }

    update(time: number, delta: number) {
        super.update(time, delta);
        this.startMovingCardToPrefferedPosition();
    }

    getUser(userId: string) {
        return this.hostUserAvatars?.getUserById(userId);
    }

    getPlayerCards(userId: string) {
        return this.cards.getPlayerCards(userId);
    }

    getTableCards() {
        return this.cards.getTableCards();
    }

    calculateCardPrefferedPositions(userAvatarContainer: UserAvatarContainer, playerCards: CardContainer[]) {
        if (playerCards.length === 0) return [];
        const cardWidth = playerCards[0].width * playerCards[0].scaleX;
        const distanceBetweenCards = Math.min(200 / playerCards.length, cardWidth);
        // get the card prefered positions
        const cardPositions = playerCards.map((card, index) => {
            const x = ((playerCards.length - 1) / 2) * distanceBetweenCards + (index * distanceBetweenCards);
            const y = 0;
            return { x, y, rotation: 0 };
        });
        return cardPositions.map(cardPosition => {
            return setPositionAndRotationRelativeToObject(userAvatarContainer, cardPosition);
        });
    }

    // update the cards into the players hands
    startMovingCardToPrefferedPosition() {
        this.hostUserAvatars?.userAvatarContainers.forEach(userAvatarContainer => {
            const playerCards = this.getPlayerCards(userAvatarContainer.user.id);
            const playerCardPositions = this.calculateCardPrefferedPositions(userAvatarContainer, playerCards);
            playerCards.forEach((card, index) => {
                if (card.moveOnDuration) return;
                // do not start moving if the card is already in the right position
                if (card.x === playerCardPositions[index].x
                    && card.y === playerCardPositions[index].y
                    && card.rotation === playerCardPositions[index].rotation) return;
                card.startMovingOverTimeTo(playerCardPositions[index], 1);
            });
        });
    }

}