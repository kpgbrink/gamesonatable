
export const suites = ['hearts', 'diamonds', 'spades', 'clubs'];
export const cards = ['Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King'];

export default class CardContainer extends Phaser.GameObjects.Container {
    suit: string | null;
    card: string | null;
    jack: boolean | null;
    backImage: Phaser.GameObjects.Image | null = null;
    frontImage: Phaser.GameObjects.Image | null = null;
    velocity: { x: number, y: number } = { x: 0, y: 0 };

    constructor(scene: Phaser.Scene, x: number, y: number, suit: string, card: string, jack: boolean = false) {
        super(scene, x, y);

        // take the 
        this.suit = suit;
        this.card = card;
        this.jack = jack;
        this.frontImage = null;
        this.loadCardImages();
    }

    public loadCardImages() {
        // add the back of the card
        this.backImage = this.scene.add.image(0, 0, 'cards', 'back');
        this.add(this.backImage);
        // add the card image
        this.frontImage = this.scene.add.image(0, 0, 'cards', this.getCardImageName());
        this.add(this.frontImage);
        // hide the card image
        this.frontImage.visible = false;
    }

    public getCardImageName() {
        if (this.jack) {
            return 'jack';
        }
        return `${this.suit}${this.card}`;
    }

    public setCard(suit: string, card: string) {
        this.suit = suit;
        this.card = card;
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

    public setCardVelocity(x: number, y: number) {
        this.velocity = { x, y };
    }

    public moveCardFromVelocity() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }

    public update() {
        this.moveCardFromVelocity();
        this.setCardFaceUp(true);
    }

}