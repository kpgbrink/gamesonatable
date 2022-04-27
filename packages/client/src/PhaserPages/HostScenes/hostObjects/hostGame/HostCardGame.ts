import { CardContent } from "api";
import socket from "../../../../SocketConnection";
import CardContainer from "../../../objects/CardContainer";
import { Cards } from "../../../objects/Cards";
import { checkTransformsAlmostEqual, DegreesToRadians, getScreenCenter, transformFromObject } from "../../../objects/Tools";
import { HostGame } from "../HostGame";
import { HostUserAvatarsAroundTableGame } from "../HostUserAvatars/HostUserAvatarsAroundTable/HostUserAvatarsAroundTableGame";
import { Shuffling } from "./states/hostCardGame/Shuffling";
import { HostGameState } from "./states/HostGameState";

export abstract class HostCardGame extends HostGame {
    scene: Phaser.Scene;
    cards: Cards;
    hostUserAvatars: HostUserAvatarsAroundTableGame | null = null;
    dealAmount: number = 10;
    currentDealerId: string | null = null;
    currentPlayerTurnId: string | null = null;
    turn: number = 0;

    abstract createGameState(): HostGameState;

    constructor(scene: Phaser.Scene) {
        super(scene);
        this.scene = scene;
        this.cards = new Cards(scene);
    }

    create() {
        super.create();
        this.hostUserAvatars = new HostUserAvatarsAroundTableGame(this.scene);
        this.hostUserAvatars.createOnRoomData();
        this.hostUserAvatars.moveToEdgeOfTable();
        const screenCenter = getScreenCenter(this.scene);
        this.cards.create(screenCenter.x, screenCenter.y);
        this.changeState(new Shuffling(this));

        socket.on('moveCardToHand', (userId: string, cardContent: CardContent) => {
            const user = this.getUser(userId);
            if (!user) return;
            const card = this.cards.getCard(cardContent);
            if (!card) return;
            card.userHandId = user.user.id;
        });
        socket.on('moveCardToTable', (userId: string, cardContent: CardContent) => {
            const user = this.getUser(userId);
            if (!user) return;
            const card = this.cards.getCard(cardContent);
            if (!card) return;
            this.onCardMoveToTable(userId, card);
        });
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

    abstract onCardMoveToTable(userId: string, card: CardContainer): void;

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

    calculateCardPrefferedTransforms(playerCards: CardContainer[]) {
        if (playerCards.length === 0) return [];
        const cardWidth = playerCards[0].width * playerCards[0].scaleX;
        const distanceBetweenCards = Math.min(200 / playerCards.length, cardWidth);
        // get the card prefered positions
        const cardPositions = playerCards.map((card, index) => {
            card.setCardFaceUp(true);
            const x = ((playerCards.length - 1) / 2) * distanceBetweenCards - (index * distanceBetweenCards);
            const y = 0;
            return { x, y, rotation: DegreesToRadians(0), scale: .5 };
        });
        return cardPositions;
    }

    // update the cards into the players hands
    startMovingCardToPrefferedPosition() {
        this.hostUserAvatars?.userAvatarContainers.forEach(userAvatarContainer => {
            const playerCards = this.getPlayerCards(userAvatarContainer.user.id);
            const playerCardTransforms = this.calculateCardPrefferedTransforms(playerCards);
            playerCards.sort((a, b) => {
                return a.timeGivenToUser - b.timeGivenToUser;
            }).forEach((card, index) => {
                if (card.moveOnDuration) return;
                const positionRotation = transformFromObject(userAvatarContainer, playerCardTransforms[index]);
                // do not start moving if the card is already in the right position
                if (checkTransformsAlmostEqual(card, positionRotation)) return;
                if (card.moveOnDuration) return;
                card.startMovingOverTimeTo(positionRotation, .4, () => {
                    card.inUserHand = true;
                });
            });
        });
    }
}