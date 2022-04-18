import { CardContent } from "api";
import socket from "../../../SocketConnection";
import CardContainer from "../../objects/CardContainer";
import { Cards } from "../../objects/Cards";
import ItemContainer from "../../objects/ItemContainer";
import { checkTransformsEqual, DegreesToRadians, getScreenCenter, getScreenDimensions } from "../../objects/Tools";
import PlayerScene from "./PlayerScene";

export class PlayerCardHand {
    cards: Cards;
    scene: PlayerScene;

    constructor(scene: PlayerScene) {
        this.scene = scene;
        this.cards = new Cards(scene);
    }

    cardsInHand() {
        const userId = socket.id;
        return this.cards.getPlayerCards(userId);
    }

    create() {
        const screenCenter = getScreenCenter(this.scene);
        this.cards.create(0, 0);
        this.cards.cardContainers.forEach(card => {

            card.rotation = DegreesToRadians(90);
            card.setScale(.5);
            card.y = -card.width * card.scale / 2 - 10;
            card.x = screenCenter.x;
            card.setInteractive();
            this.scene.input.setDraggable(card);

            this.scene.input.on('drag', (pointer: any, gameObject: ItemContainer, dragX: number, dragY: number) => {
                gameObject.x = dragX;
                gameObject.y = dragY;
            });
            // on drag start set dragging true
            this.scene.input.on('dragstart', (pointer: any, gameObject: ItemContainer) => {
                gameObject.isDragging = true;
                gameObject.depth = 2;
                gameObject.moveOnDuration = null;
            });
            // on drag end set dragging false
            this.scene.input.on('dragend', (pointer: any, gameObject: ItemContainer) => {
                gameObject.isDragging = false;
            });
        });

        // add socket listeners
        socket.on('give card', (cardContent: CardContent) => {
            console.log('card given', cardContent);
            // get the card that has to be given to player
            const card = this.cards.getCard(cardContent);
            if (!card) throw new Error('card not found');
            card.x += 1;
            // move the card to the player
            card.inUserHandId = socket.id;
            // move the card to the player hand
            // this.moveCardToPlayerHand(card);
            card.setCardFaceUp(true);
            // tell the table to put the card in the player hand
        });
    }

    moveCardToPlayerHand(card: CardContainer) {
        // screen center
        const screenCenter = getScreenCenter(this.scene);
        // start moving this card
        card.startMovingOverTimeTo({
            x: screenCenter.x,
            y: screenCenter.y,
            rotation: 0,
            scale: 1
        }, 1);
        card.setCardFaceUp(true);
    }

    calculateCardPrefferedPositions() {
        const cards = this.cardsInHand();
        if (cards.length === 0) return [];
        const cardWidth = cards[0].width * cards[0].scaleX;

        const screenCenter = getScreenCenter(this.scene);
        const screenDimensions = getScreenDimensions(this.scene);
        const distanceBetweenCards = Math.min((screenDimensions.width - 200) / cards.length, cardWidth);
        // get the card prefered positions
        const cardPositions = cards.map((card, index) => {
            const x = screenCenter.x - ((cards.length - 1) / 2) * distanceBetweenCards + (index * distanceBetweenCards);
            const y = screenCenter.y;
            return { x, y, rotation: 0, scale: 2 };
        });
        return cardPositions;
    }

    startMovingCardToPrefferedPosition() {
        const cards = this.cardsInHand();
        const cardPositions = this.calculateCardPrefferedPositions();
        cards.sort((a, b) => a.x - b.x).forEach((card, index) => {
            if (card.moveOnDuration) return;
            // console.log('start the movement', card.x, cardPositions[index].x);
            // do not start moving if the card is already in the right position
            if (checkTransformsEqual(card, cardPositions[index])) return;
            // do not start moving the card if it is being dragged
            if (card.isDragging) return;

            card.startMovingOverTimeTo(cardPositions[index], .5);
            card.depth = index / cards.length;
        });
    }

    update(time: number, delta: number) {
        this.cards.update(time, delta);
        this.startMovingCardToPrefferedPosition();
    }
}