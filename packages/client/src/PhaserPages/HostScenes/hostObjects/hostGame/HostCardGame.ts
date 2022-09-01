import { CardGameData, PlayerCardHandData } from "api/src/data/datas/CardData";
import socket from "../../../../SocketConnection";
import { Cards } from "../../../objects/Cards";
import CardContainer from "../../../objects/items/CardContainer";
import { checkTransformsAlmostEqual, getScreenCenter, Transform, transformFromObject, transformRelativeToObject } from "../../../objects/Tools";
import { CardGameUserAvatarContainer } from "../../../objects/userAvatarContainer/CardGameUserAvatarContainer";
import { ValueWithDefault } from "../../../objects/ValueWithDefault";
import { HostGame } from "../HostGame";
import { HostUserAvatarsAroundTableGame } from "../HostUserAvatars/HostUserAvatarsAroundTable/HostUserAvatarsAroundTableGame";
import { Shuffling } from "./states/hostCardGame/Shuffling";

export abstract class HostCardGame<
    GameDataType extends CardGameData,
    PlayerDataType extends PlayerCardHandData,
    UserAvatarsType extends HostUserAvatarsAroundTableGame<UserAvatarType>,
    UserAvatarType extends CardGameUserAvatarContainer<PlayerDataType>> extends HostGame<PlayerDataType, GameDataType> {
    scene: Phaser.Scene;
    cards: Cards;
    hostUserAvatars: UserAvatarsType | null = null;
    dealAmount: number = 10;
    currentDealerId: string | null = null;
    currentPlayerTurnId: string | null = null;
    turn: number = 0;

    cardInHandTransform: ValueWithDefault<Transform> = new ValueWithDefault({ x: 0, y: 0, rotation: 0, scale: 0.5 });

    minDistanceBetweenCards: ValueWithDefault<number> = new ValueWithDefault(200);

    constructor(scene: Phaser.Scene, gameData: GameDataType) {
        super(scene, gameData);
        this.scene = scene;
        this.cards = new Cards(scene);
    }

    preload() {
        super.preload();
    }

    abstract createHostUserAvatarsAroundTableGame(): void;

    create() {
        super.create();
        this.createHostUserAvatarsAroundTableGame();
        const screenCenter = getScreenCenter(this.scene);
        this.cards.create(screenCenter.x, screenCenter.y);
        this.changeState(new Shuffling(this));

        socket.on('moveCardToHand', (userId: string, cardId: number) => {
            const user = this.getUser(userId);
            if (!user) return;
            const card = this.cards.getCard(cardId);
            if (!card) return;
            card.setFaceUp(false);
            card.userHandId = user.user.id;
        });
        socket.on('moveCardToTable', (userId: string, cardId: number) => {
            const user = this.getUser(userId);
            if (!user) return;
            const card = this.cards.getCard(cardId);
            if (!card) return;
            this.onCardMoveToTable(userId, card);
        });
    }

    override getPlayerData(userId: string) {
        // get the user state for the user on just the card stuff
        const user = this.getUser(userId);
        if (!user) return;
        // TODO WORKING ON THIS RIGHT NOW
        const playerCardHandState = user.playerCardHandState;
        if (!playerCardHandState) return;

        const cardsInHand = this.getPlayerCards(userId);
        playerCardHandState.cardIds = cardsInHand.map(card => card.id);

        return playerCardHandState;
    }

    override onPlayerDataToHost(playerData: Partial<PlayerDataType>): void {
        // TODO update the player avatar

    }

    override getGameData() {
        return this.gameData;
    }

    override onGameDataToHost(gameData: Partial<GameDataType>): void {
        // TODO update the game data

    }

    getDealer() {
        if (!this.currentDealerId) throw new Error('No dealer set');
        const dealer = this.hostUserAvatars?.getUserById(this.currentDealerId);
        if (!dealer) throw new Error('No dealer found');
        return dealer;
    }

    randomizeDealer() {
        // choose a random dealer
        this.currentDealerId = this.hostUserAvatars?.getRandomUserIdInGame() || null;
    }

    setNextDealer() {
        if (!this.currentDealerId) {
            this.randomizeDealer();
            return;
        }
        this.currentDealerId = this.getNextPlayerId(this.currentDealerId);
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
        return this.hostUserAvatars.getNextUserIdFromRotationInGame(playerId);
    }

    abstract onCardMoveToTable(userId: string, card: CardContainer): void;

    update(time: number, delta: number) {
        super.update(time, delta);
        this.startMovingCardInHandToPrefferedPosition();
    }

    // make this able to return the higher type
    getUser(userId: string) {
        return this.hostUserAvatars?.getUserById(userId);
    }

    getPlayerCards(userId: string | null) {
        return this.cards.getPlayerCards(userId);
    }

    getTableCards() {
        return this.cards.getTableCards();
    }

    calculateCardInHandPrefferedTransforms(playerCards: CardContainer[]) {
        if (playerCards.length === 0) return [];
        const cardWidth = playerCards[0].width * playerCards[0].scaleX;
        const distanceBetweenCards = Math.min(this.minDistanceBetweenCards.value / playerCards.length, cardWidth);
        // get the card prefered positions
        const cardInHandTransform = this.cardInHandTransform.value;
        const cardPositions = playerCards.map((card, index) => {
            const cardInHandOffsetTransform = card.cardInHandOffsetTransform.value;
            const x = ((playerCards.length - 1) / 2) * distanceBetweenCards - (index * distanceBetweenCards) + cardInHandTransform.x + cardInHandOffsetTransform.x;
            const y = cardInHandTransform.y + cardInHandOffsetTransform.y;
            return { x, y, rotation: cardInHandTransform.rotation + cardInHandOffsetTransform.rotation, scale: cardInHandTransform.scale * cardInHandOffsetTransform.scale };
        });
        return cardPositions;
    }

    // update the cards into the players hands
    startMovingCardInHandToPrefferedPosition() {
        this.hostUserAvatars?.userAvatarContainers.forEach(userAvatarContainer => {
            const playerCards = this.getPlayerCards(userAvatarContainer.user.id).sort((a, b) => a.timeGivenToUser - b.timeGivenToUser);
            const playerCardTransforms = this.calculateCardInHandPrefferedTransforms(playerCards);
            playerCards.forEach((card, index) => {
                if (card.moveOnDuration) return;
                const positionRotation = transformFromObject(userAvatarContainer, playerCardTransforms[index]);
                // do not start moving if the card is already in the right position
                if (checkTransformsAlmostEqual(card, positionRotation)) return;
                if (card.moveOnDuration) return;
                card.startMovingOverTimeTo(positionRotation, .4, () => {
                    card.inUserHand = true;
                });
            });
            // set the depth of the cards based on x position relative to user avatar
            playerCards.sort((a, b) => {
                const aR = transformRelativeToObject(userAvatarContainer, a);
                const bR = transformRelativeToObject(userAvatarContainer, b);
                return aR.x - bR.x;
            }).forEach((card, index) => {
                card.depth = index;
            });
        });
    }

    setDealButtonOnUser() {
        // set that the next dealer can deal with the deal button
        // get the next player after the dealer
        if (!this.currentDealerId) {
            throw new Error('No dealer set');
        }
        const nextDealerId = this.getNextPlayerId(this.currentDealerId);
        socket.emit('can deal', nextDealerId);
    }

    isUserTurn(userId: string) {
        return this.currentPlayerTurnId === userId;
    }
}