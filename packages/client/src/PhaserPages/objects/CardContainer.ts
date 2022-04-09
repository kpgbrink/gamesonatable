import { CardContent } from "api";
import { CountdownTimer } from "./CountdownTimer";
import { calculateMovementFromTimer, IMoveItemOverTime, ITableItem, millisecondToSecond, PositionAndRotation } from "./Tools";

export default class CardContainer extends Phaser.GameObjects.Container implements IMoveItemOverTime, ITableItem {
    cardContent: CardContent;

    backImage: Phaser.GameObjects.Image | null = null;
    frontImage: Phaser.GameObjects.Image | null = null;
    velocity: { x: number, y: number, rotation: number } = { x: 0, y: 0, rotation: 0 };
    mass: number = 1;
    inUserHandId: string | null = null;

    // for movement over time
    startPosition: PositionAndRotation | null = null;
    endPosition: PositionAndRotation | null = null;
    movementCountdownTimer: CountdownTimer | null = null;

    constructor(scene: Phaser.Scene, x: number, y: number, suit: string, card: string, joker: boolean = false) {
        super(scene, x, y);
        // take the 
        this.cardContent = {
            suit,
            card,
            joker
        };
        this.frontImage = null;
        this.addCardImages();
    }

    public addCardImages() {
        // add the back of the card
        this.backImage = this.scene.add.image(0, 0, 'cards', 'back');
        this.add(this.backImage);
        // add the card image
        this.frontImage = this.scene.add.image(0, 0, 'cards', this.getCardImageName());
        this.add(this.frontImage);
        // hide the card image
        this.frontImage.visible = false;
        // set the card image to the back
        this.setSize(this.backImage.width, this.backImage.height);
    }

    public getCardImageName() {
        if (this.cardContent.joker) {
            return 'joker';
        }
        return `${this.cardContent.suit}${this.cardContent.card}`;
    }

    public setCard(suit: string, card: string) {
        this.cardContent.suit = suit;
        this.cardContent.card = card;
    }

    public setCardFaceUp(faceUp: boolean) {
        // Switch the card image to the back or front
        if (!this.frontImage || !this.backImage) return;
        this.frontImage.visible = faceUp;
        this.backImage.visible = !faceUp;
    }

    public setCardPosition(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public setCardVelocity(x: number, y: number, rotation: number) {
        this.velocity = { x, y, rotation };
    }

    public moveCardFromVelocity(delta: number) {
        this.x += this.velocity.x * millisecondToSecond(delta);
        this.y += this.velocity.y * millisecondToSecond(delta);
        this.rotation += this.velocity.rotation * millisecondToSecond(delta);
    }

    public startMovingCardTo(toPosition: PositionAndRotation, time: number) {
        this.velocity = { x: 0, y: 0, rotation: 0 };
        this.endPosition = toPosition;
        this.setStartPositionAsCurentPosition();
        this.movementCountdownTimer = new CountdownTimer(time);
    }

    public moveCardOverTime(time: number, delta: number) {
        if (!this.startPosition || !this.endPosition) return;
        if (!this.movementCountdownTimer) return;
        if (this.movementCountdownTimer.wasDone()) {
            this.startPosition = null;
            this.endPosition = null;
            this.movementCountdownTimer = null;
            return;
        }
        const movement = calculateMovementFromTimer(this.movementCountdownTimer, delta, this.startPosition, { x: this.x, y: this.y, rotation: this.rotation }, this.endPosition);
        this.x += movement.x;
        this.y += movement.y;
        this.rotation += movement.rotation;
        this.movementCountdownTimer.update(delta);
    }

    public update(time: number, delta: number) {
        this.moveCardOverTime(time, delta);
        this.moveCardFromVelocity(delta);
    }

    public setStartPositionAsCurentPosition() {
        this.startPosition = {
            x: this.x,
            y: this.y,
            rotation: this.rotation
        };
    }

}