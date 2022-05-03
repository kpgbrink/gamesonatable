import ItemContainer from "./ItemContainer";


export default class PokerChip extends ItemContainer {
    pokerChipImage: Phaser.GameObjects.Image | null = null;

    constructor(scene: Phaser.Scene, x: number, y: number, pokerChipImage: string) {
        super(scene, x, y);
        this.addImage(pokerChipImage);
    }

    addImage(pokerChipImage: string) {
        this.pokerChipImage = this.scene.add.image(0, 0, pokerChipImage);
        this.add(this.pokerChipImage);
        this.setSize(this.pokerChipImage.width, this.pokerChipImage.height);
    }
}