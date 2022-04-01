import { Cards } from "../../../objects/Cards";
import { getScreenCenter } from "../../../objects/Tools";
import { HostGame } from "../HostGame";
import { Shuffling } from "./states/hostCardGame/Shuffling";


export class HostCardGame extends HostGame {
    cards: Cards
    scene: Phaser.Scene

    constructor(scene: Phaser.Scene) {
        super(scene);
        this.scene = scene;
        this.cards = new Cards(scene);
    }

    create() {
        super.create();
        const screenCenter = getScreenCenter(this.scene);
        this.cards.create(screenCenter.x, screenCenter.y);
        this.cards.setDepth(10);
        this.changeState(new Shuffling(this));
    }

    update() {
        super.update();
    }

}