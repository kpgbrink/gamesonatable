import { User } from "api";
import PokerChip from "./items/PokerChip";
import { getScreenCenter, transformFromObject } from "./Tools";
import UserAvatarContainer from "./UserAvatarContainer";

export default class ThirtyOneUserAvatarContainer extends UserAvatarContainer {
    lives: number = 3;
    pokerChipsDistance: number = 160;
    bluePokerChips: PokerChip[] = [];
    removingPokerChips: PokerChip[] = [];
    roundScore: number = 0;

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
            });

            pokerChip.setDepth(this.depth + 1000);
            this.bluePokerChips.push(pokerChip);
        }
    }

    updatePokerChips() {
        // remove any poker chips that are not in the life anymore
        while (this.bluePokerChips.length > Math.max(this.lives, 0)) {
            const pokerChip = this.bluePokerChips.pop();
            if (pokerChip) {
                this.removingPokerChips.push(pokerChip);
                this.movePokerChipOffTableCooly(pokerChip);
            }
        }
    }

    movePokerChipOffTableCooly(pokerChip: PokerChip) {
        const transformAboveHead = transformFromObject(this, { x: 0, y: 300, rotation: 0, scale: .8 });
        const transformHitPlayer = transformFromObject(this, { x: 0, y: 50, rotation: 0, scale: .2 });
        const transformOffTable = transformFromObject(this, { x: 0, y: 10000, rotation: 0, scale: .4 });
        pokerChip.startMovingOverTimeTo(transformAboveHead, 1, () => {
            pokerChip.startMovingOverTimeTo(transformHitPlayer, .5, () => {
                pokerChip.startMovingOverTimeTo(transformAboveHead, 1, () => {
                    pokerChip.startMovingOverTimeTo(transformHitPlayer, .3, () => {
                        pokerChip.startMovingOverTimeTo(transformAboveHead, 1, () => {
                            pokerChip.startMovingOverTimeTo(transformHitPlayer, .2, () => {
                                pokerChip.startMovingOverTimeTo(transformOffTable, 1, () => {
                                    this.removingPokerChips.splice(this.removingPokerChips.indexOf(pokerChip), 1);
                                    pokerChip.destroy();
                                });
                            });
                        });
                    });
                });
            });
        });

    }

    update(time: number, delta: number) {
        super.update(time, delta);
        this.bluePokerChips.forEach(pokerChip => {
            pokerChip.update(time, delta)
        });
        this.removingPokerChips.forEach(pokerChip => {
            pokerChip.update(time, delta)
        });
    }
}