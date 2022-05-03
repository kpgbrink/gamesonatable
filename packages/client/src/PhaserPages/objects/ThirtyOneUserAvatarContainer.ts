import { User } from "api";
import PokerChip from "./items/PokerChip";
import { getScreenCenter, transformFromObject } from "./Tools";
import UserAvatarContainer from "./UserAvatarContainer";

export default class ThirtyOneUserAvatarContainer extends UserAvatarContainer {
    lives: number = 3;
    pokerChipsDistance: number = 160;
    bluePokerChips: PokerChip[] = [];

    constructor(scene: Phaser.Scene, x: number, y: number, user: User) {
        super(scene, x, y, user);
    }

    create() {
        this.createPokerChipLives();
    }

    createPokerChipLives() {
        const screenCenter = getScreenCenter(this.scene);
        // put as many poker chips as lives in front of the user avatar
        for (let i = 0; i < this.lives; i++) {
            const pokerChip = new PokerChip(this.scene, screenCenter.x, screenCenter.y, 'bluePokerChip');
            this.scene.add.existing(pokerChip);


            const x = i * this.pokerChipsDistance - this.pokerChipsDistance * (this.lives - 1) / 2;

            const pokerChipTransform = { x: x, y: 200, rotation: 0, scale: .4 };

            const newTransform = transformFromObject(this, pokerChipTransform);

            pokerChip.startMovingOverTimeTo(newTransform, 1, () => {
                console.log('poker chip moved');
            });

            // pokerChip.setPosition(newTransform.x, newTransform.y);
            // pokerChip.setScale(newTransform.scale);
            // pokerChip.setRotation(newTransform.rotation);

            pokerChip.setDepth(this.depth + 1000);
            this.bluePokerChips.push(pokerChip);
        }
    }

    update(time: number, delta: number) {
        super.update(time, delta);
        this.bluePokerChips.forEach(pokerChip => {
            pokerChip.update(time, delta)
        });
    }
}