import { CardContent } from "api";
import ItemContainer from "./ItemContainer";
import { ITableItem } from "./Tools";

export default class CardContainer extends ItemContainer implements ITableItem {
    cardContent: CardContent;

    backImage: Phaser.GameObjects.Image | null = null;
    frontImage: Phaser.GameObjects.Image | null = null;
    velocity: { x: number, y: number, rotation: number } = { x: 0, y: 0, rotation: 0 };
    mass: number = 1;
    inUserHandId: string | null = null;

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

    public setCardFaceUp(faceUp: boolean) {
        // Switch the card image to the back or front
        if (!this.frontImage || !this.backImage) return;
        this.frontImage.visible = faceUp;
        this.backImage.visible = !faceUp;
    }

    public getFaceUp() {
        return this.frontImage?.visible;
    }

    public update(time: number, delta: number) {
        super.update(time, delta);
    }
}