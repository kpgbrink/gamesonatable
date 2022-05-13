import { CardContent } from "api";
import socket from "../../../SocketConnection";
import { Cards } from "../../objects/Cards";
import CardContainer from "../../objects/items/CardContainer";
import MenuButton from "../../objects/MenuButton";
import { checkTransformsAlmostEqual, DegreesToRadians, getScreenCenter, getScreenDimensions, Transform } from "../../objects/Tools";
import PlayerScene from "./PlayerScene";

export abstract class PlayerCardHand {
    dealButton: MenuButton | null = null;
    cards: Cards;
    scene: PlayerScene;
    moveToHandTime: number = .2;
    moveToPickUpTime: number = .05;
    allowedPickUpCardAmount = 0;
    allowedDropCardAmount = 0;

    tablePosition: Transform;
    pickUpAndPlaceBasePosition: Transform;
    handBasePosition: Transform;

    cardBasePositions: Transform[] = [];

    constructor(scene: PlayerScene) {
        this.scene = scene;
        this.cards = new Cards(scene);
        const screenCenter = getScreenCenter(scene);
        this.tablePosition = { x: screenCenter.x, y: 0 - 500, rotation: DegreesToRadians(90), scale: .5 };
        this.pickUpAndPlaceBasePosition = {
            x: screenCenter.x,
            y: screenCenter.y - 400,
            rotation: 0,
            scale: 1.3
        };
        this.handBasePosition = {
            x: screenCenter.x,
            y: screenCenter.y,
            rotation: 0,
            scale: 2
        };
        this.cardBasePositions.push(this.tablePosition);
        this.cardBasePositions.push(this.handBasePosition);
        this.cardBasePositions.push(this.pickUpAndPlaceBasePosition);
    }

    cardsInHand() {
        const userId = socket.id;
        return this.cards.getPlayerCards(userId);
    }

    create() {
        this.cards.create(0, 0);
        this.cards.cardContainers.forEach(card => {
            card.setTransform(this.tablePosition);
            card.setInteractive();
            this.scene.input.setDraggable(card);

            this.scene.input.on('drag', (pointer: any, gameObject: CardContainer, dragX: number, dragY: number) => {
                if (gameObject.cardBackOnTable) return;
                gameObject.x = dragX;
                gameObject.y = dragY;

            });
            // on drag start set dragging true
            this.scene.input.on('dragstart', (pointer: any, gameObject: CardContainer) => {
                gameObject.beforeDraggedTransform = {
                    x: gameObject.x,
                    y: gameObject.y,
                    rotation: gameObject.rotation,
                    scale: gameObject.scale
                };
                gameObject.isDragging = true;
                gameObject.depth = 2;
                gameObject.moveOnDuration = null;
            });
            // on drag end set dragging false
            this.scene.input.on('dragend', (pointer: any, gameObject: CardContainer) => {
                gameObject.isDragging = false;
                this.checkIfMoveCardToHand(gameObject);
                this.checkIfMoveCardToTable(gameObject);
            });
        });

        // add socket listeners
        socket.on('give card', (cardContent: CardContent, timeGivenToUser: number) => {
            // get the card that has to be given to player
            const card = this.cards.getCard(cardContent);
            if (!card) throw new Error('card not found');
            card.x += 1;
            // move the card to the player
            card.setUserHand(socket.id, timeGivenToUser);
            // move the card to the player hand
            // this.moveCardToPlayerHand(card);
            card.setFaceUp(true);
            // tell the table to put the card in the player hand

            this.dealButton?.setVisible(false);
        });

        socket.on('moveCardToTable', (cardContent: CardContent) => {
            // get the card that has to be given to player
            const card = this.cards.getCard(cardContent);
            if (!card) throw new Error('card not found');
            // move the card back to the table
            this.putCardBackOnTable(card);

            // tell the table to put the card in the player hand
        });

        // create deal button
        const screenDimensions = getScreenDimensions(this.scene);
        this.dealButton = new MenuButton(screenDimensions.width / 2, 100, this.scene);
        this.dealButton.setInteractive();
        this.dealButton.setText('DEAL');
        this.dealButton.on('pointerdown', () => {
            this.dealButton?.setVisible(false);
            socket.emit('deal');
        });
        this.dealButton.setVisible(false);
        this.scene.add.existing(this.dealButton);

        socket.on('can deal', () => {
            this.dealButton?.setVisible(true);
        });
    }


    setCardToPickUp(card: CardContent, faceUp: boolean, order: number) {
        const cardContainer = this.cards.getCard(card);
        if (!cardContainer) throw new Error('card not found');
        cardContainer.order = order;
        cardContainer.setFaceUp(faceUp);
        cardContainer.canTakeFromTable = true;
        cardContainer.userHandId = null;
        cardContainer.inUserHand = false;
        cardContainer.cardBackOnTable = false;
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
        card.setFaceUp(true);
    }

    calculateCardPrefferedPositions(cards: CardContainer[], transform: Transform) {
        if (cards.length === 0) return [];
        const cardWidth = cards[0].width * cards[0].scaleX;

        const screenDimensions = getScreenDimensions(this.scene);
        const distanceBetweenCards = Math.min((screenDimensions.width - 200) / cards.length, cardWidth);
        // get the card prefered positions
        const cardPositions = cards.map((card, index) => {
            const x = transform.x - ((cards.length - 1) / 2) * distanceBetweenCards + (index * distanceBetweenCards);
            const y = transform.y;
            return { x, y, rotation: 0, scale: transform.scale };
        });
        return cardPositions;
    }

    startMovingCardsInHandToPrefferedPosition() {
        const cards = this.cardsInHand();
        const cardPositions = this.calculateCardPrefferedPositions(cards, this.handBasePosition);
        cards.sort((a, b) => {
            // if not in userHand yet then move to bottom
            if (!a.inUserHand && b.inUserHand) return 1;
            if (a.inUserHand && !b.inUserHand) return -1;
            if (!a.inUserHand && !b.inUserHand) {
                // if not moving yet then move to bottom
                return a.timeGivenToUser - b.timeGivenToUser;
            }
            return a.x - b.x;
        }).forEach((card, index) => {
            // do not start new movement if old movement already going to same position
            if (card.moveOnDuration?.endTransform && checkTransformsAlmostEqual(card.moveOnDuration.endTransform, cardPositions[index])) return;
            // do not start moving if the card is already in the right position
            if (checkTransformsAlmostEqual(card, cardPositions[index])) {
                card.inUserHand = true;
                return;
            }
            // do not start moving the card if it is being dragged
            if (card.isDragging) return;

            card.startMovingOverTimeTo(cardPositions[index], this.moveToHandTime, () => {
                card.inUserHand = true;
            });
            card.depth = index / cards.length;
        });
    }

    startMovingCardsToPickUpToPrefferedPosition() {
        const cards = this.cardToPickUp();
        const cardPositions = this.calculateCardPrefferedPositions(cards, this.pickUpAndPlaceBasePosition);
        cards.sort((a, b) => {
            return a.order - b.order;
        }).forEach((card, index) => {
            // do not start new movement if old movement already going to same position
            if (card.moveOnDuration?.endTransform && checkTransformsAlmostEqual(card.moveOnDuration.endTransform, cardPositions[index])) return;
            // do not start moving if the card is already in the right position
            if (checkTransformsAlmostEqual(card, cardPositions[index])) return;
            // do not start moving the card if it is being dragged
            if (card.isDragging) return;
            card.startMovingOverTimeTo(cardPositions[index], this.moveToPickUpTime, () => { });
            card.depth = index / cards.length;
        });
    }

    cardToPickUp() {
        return this.cards.cardContainers.filter(card => card.canTakeFromTable);
    }

    // move dragged card to player hand if being dragged down
    checkIfMoveCardToHand(draggedCard: CardContainer) {
        // check if the card is lower than the starting drag position
        if (!draggedCard.canTakeFromTable) return;
        if (draggedCard.beforeDraggedTransform === null) return;
        if (draggedCard.y < draggedCard.beforeDraggedTransform.y) return;
        socket.emit('moveCardToHand', draggedCard.cardContent);
        draggedCard.setFaceUp(true);
        draggedCard.userHandId = socket.id;
        draggedCard.canTakeFromTable = false;
        this.setAllowedPickUpCardAmount(this.allowedPickUpCardAmount - 1);
    }

    setAllowedPickUpCardAmount(amount: number) {
        this.allowedPickUpCardAmount = amount;
        if (amount === 0) {
            // put all the pickupable cards back to the table
            this.cardToPickUp().forEach(card => {
                card.canTakeFromTable = false;
                // move the card back to the table
                card.cardBackOnTable = true;
            });
            this.onAllCardsPickedUp();
        }
    }

    startMovingCardsBackToTable() {
        const cards = this.cards.cardsInDeck();
        cards.forEach(card => {
            if (card.moveOnDuration) return;
            card.startMovingOverTimeTo(this.tablePosition, 1);
        });
    }

    checkIfMoveCardToTable(card: CardContainer) {
        if (card.beforeDraggedTransform === null) return;
        if (card.y > card.beforeDraggedTransform?.y) return;
        if (card.cardBackOnTable) return;
        if (!card.userHandId) return;
        if (this.allowedDropCardAmount <= 0) return;
        // tell host to move the card to the table
        socket.emit('moveCardToTable', card.cardContent);
        this.allowedDropCardAmount -= 1;
        this.putCardBackOnTable(card);
    }

    putCardBackOnTable(card: CardContainer) {
        card.inUserHand = false;
        card.userHandId = null;
        card.canTakeFromTable = false;
        card.cardBackOnTable = true;
    }

    update(time: number, delta: number) {
        this.cards.update(time, delta);
        this.startMovingCardsInHandToPrefferedPosition();
        this.startMovingCardsToPickUpToPrefferedPosition();
        this.startMovingCardsBackToTable();
    }

    abstract onAllCardsPickedUp(): void
}