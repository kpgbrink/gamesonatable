import { CardGameData, PlayerCardHandData } from "api/src/data/datas/CardData";
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
    turn: number = 0;

    cardInHandTransform: ValueWithDefault<Transform> = new ValueWithDefault({ x: 0, y: 0, rotation: 0, scale: 0.5 });

    minDistanceBetweenCards: ValueWithDefault<number> = new ValueWithDefault(200);

    constructor(scene: Phaser.Scene) {
        super(scene);
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
    }

    // ------------------------------------ Data ------------------------------------
    override getPlayerDataToSend(userId: string) {
        const user = this.getUser(userId);
        if (!user) throw new Error("User not found");
        const playerCardHandDataEmpty: Partial<PlayerDataType> = {};
        const playerCardHandData: Partial<PlayerDataType> = { ...playerCardHandDataEmpty, ...user.playerCardHandData, ...super.getPlayerDataToSend(userId) };
        // get the user state for the user on just the card stuff
        // TODO WORKING ON THIS RIGHT NOW

        const cardsInHand = this.getPlayerCards(userId);
        playerCardHandData.cardIds = cardsInHand.map(card => card.id);

        return playerCardHandData;
    }

    override onPlayerDataReceived(userId: string, playerData: Partial<PlayerDataType>, gameData: Partial<GameDataType> | null): void {
        super.onPlayerDataReceived(userId, playerData, gameData);
    }

    updateCardsInHand(userId: string, playerData: Partial<PlayerDataType>, allowedCardsToPickUp: number[], allowPickUpCardTo: number | null, allowDropCardTo: number | null) {
        console.log('update cards in hand');
        console.log('playerData', playerData);
        if (!playerData.cardIds) return;
        const user = this.getUser(userId);
        if (!user) return;
        // TODO update the cards in hand
        const newCardsInHand = playerData.cardIds;
        const oldCardsInHand = this.cards.getPlayerCardsIds(userId);
        const cardsToRemove = oldCardsInHand.filter(cardId => !newCardsInHand.includes(cardId));
        const cardsToAdd = newCardsInHand.filter(cardId => !oldCardsInHand.includes(cardId));
        console.log('cardsToRemove', cardsToRemove);
        console.log('cardsToAdd', cardsToAdd);
        console.log('allowed pick up cards', allowedCardsToPickUp);

        // number of cards left in hand after cards are dropped
        const cardsLeftInHand = oldCardsInHand.length - cardsToRemove.length + cardsToAdd.length;
        const checkIfAllowedToDropCards = allowDropCardTo !== null && allowDropCardTo <= cardsLeftInHand;
        // check if allowed to drop the cards
        if (checkIfAllowedToDropCards) {
            console.log('allowed to drop cards');
            // put back on table
            cardsToRemove.forEach(cardId => {
                const card = this.cards.getCard(cardId);
                if (!card) return;
                card.setDepth(999);
                this.onCardMoveToTable(user.user.id, card);
            });
        }
        // check if all cards to add are in the allowed to pick up cards
        const cardIdsToPickUpAllowed = allowPickUpCardTo !== null && cardsToAdd.every(cardId => allowedCardsToPickUp.includes(cardId));
        const checkIfAllowedToPickUpCards = allowPickUpCardTo !== null && allowPickUpCardTo >= cardsLeftInHand && cardIdsToPickUpAllowed;
        // check if allowed to pick up the cards
        if (checkIfAllowedToPickUpCards) {
            // put in hand
            console.log('allowed to pick up cards');
            cardsToAdd.forEach(cardId => {
                const card = this.cards.getCard(cardId);
                if (!card) return;
                card.depth = 999999;
                card.userHandId = user.user.id;
            });
        }
        const cardsInHand = this.getPlayerCards(userId);
        // if either cards are not allowed to be picked up or dropped but there are cards to be added or removed
        // then send the player data back to the user

        if ((cardsToAdd.length > 0 && !checkIfAllowedToPickUpCards) || (cardsToRemove.length > 0 && !checkIfAllowedToDropCards)) {
            const playerDataToSend: Partial<PlayerDataType> = {};
            playerDataToSend.cardIds = cardsInHand.map(card => card.id);
            console.log('Player has wrong data fix it');
            this.sendPlayerData(userId, playerDataToSend);
        }
    }

    override getGameDataToSend() {
        return this.gameData;
    }

    // TODO update the game data
    override onGameDataReceived(userId: string, gameData: Partial<GameDataType>, playerData: Partial<PlayerDataType> | null, updateGameData: boolean): void {
        // TODO update the game data
        super.onGameDataReceived(userId, gameData, playerData, updateGameData);
    }
    // ------------------------------------ Data End ------------------------------------

    getDealer() {
        if (!this.gameData.playerDealerId) throw new Error('No dealer set');
        const dealer = this.hostUserAvatars?.getUserById(this.gameData.playerDealerId);
        if (!dealer) throw new Error('No dealer found');
        return dealer;
    }

    randomizeDealer() {
        // choose a random dealer
        this.gameData.playerDealerId = this.hostUserAvatars?.getRandomUserIdInGame() || null;
    }

    setNextDealer() {
        if (!this.gameData.playerDealerId) {
            this.randomizeDealer();
            return;
        }
        this.gameData.playerDealerId = this.getNextPlayerId(this.gameData.playerDealerId);
    }

    setNextPlayerTurn() {
        this.turn++;
        if (this.gameData.playerTurnId === null) {
            this.gameData.playerTurnId = this.getNextPlayerId(this.getDealer().user.id);
            return;
        }
        this.gameData.playerTurnId = this.getNextPlayerId(this.gameData.playerTurnId);
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
                const moveTime = (() => {
                    if (card.inUserHand) {
                        return 0.1;
                    }
                    if (card.getFaceUp()) {
                        return 2.5;
                    }
                    return 1.2;
                })();
                card.startMovingOverTimeTo(positionRotation, moveTime, () => {
                    card.inUserHand = true;
                    card.setFaceUp(false);
                });
            });
            // set the depth of the cards based on x position relative to user avatar
            playerCards.sort((a, b) => {
                const aR = transformRelativeToObject(userAvatarContainer, a);
                const bR = transformRelativeToObject(userAvatarContainer, b);
                return aR.x - bR.x;
            }).forEach((card, index) => {
                if (card.inUserHand) {
                    card.depth = index;
                }
            });
        });
    }

    setDealButtonOnUser() {
        // set that the next dealer can deal with the deal button
        // get the next player after the dealer
        if (!this.gameData.playerDealerId) {
            throw new Error('No dealer set');
        }
        const nextDealerId = this.getNextPlayerId(this.gameData.playerDealerId);
        this.gameData.playerDealerId = nextDealerId;
        this.sendGameData();
    }

    isUserTurn(userId: string) {
        return this.gameData.playerTurnId === userId;
    }
}