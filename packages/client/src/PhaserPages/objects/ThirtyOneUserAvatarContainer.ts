import { User } from "api";
import { transformFromObject } from "./Tools";
import UserAvatarContainer from "./UserAvatarContainer";

export default class ThirtyOneUserAvatarContainer extends UserAvatarContainer {
    lives: number = 3;
    bluePokerImages: Phaser.GameObjects.Image[] = [];
    pokerChipsDistance: number = 160;

    constructor(scene: Phaser.Scene, x: number, y: number, user: User) {
        super(scene, x, y, user);
    }

    create() {
        // put as many poker chips as lives in front of the user avatar
        for (let i = 0; i < this.lives; i++) {
            const pokerChip = this.scene.add.image(0, 0, 'bluePokerChip');
            const x = i * this.pokerChipsDistance - this.pokerChipsDistance * (this.lives - 1) / 2;
            const pokerChipTransform = { x: x, y: 200, rotation: 0, scale: .4 };
            const newTransform = transformFromObject(this, pokerChipTransform);

            pokerChip.setPosition(newTransform.x, newTransform.y);
            pokerChip.setScale(newTransform.scale);
            pokerChip.setRotation(newTransform.rotation);

            pokerChip.setDepth(this.depth + 1000);
            this.bluePokerImages.push(pokerChip);
            console.log('create poker image');
        }
    }
}