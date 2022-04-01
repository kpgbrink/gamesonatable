import { Cards } from "../../../objects/Cards";
import { getScreenCenter } from "../../../objects/Tools";
import { HostGame } from "../HostGame";
import { HostUserAvatarsAroundTableGame } from "../HostUserAvatars/HostUserAvatarsAroundTable/HostUserAvatarsAroundTableGame";
import { Shuffling } from "./states/hostCardGame/Shuffling";


export class HostCardGame extends HostGame {
    cards: Cards
    scene: Phaser.Scene
    hostUserAvatars: HostUserAvatarsAroundTableGame;

    constructor(scene: Phaser.Scene) {
        super(scene);
        this.scene = scene;
        this.cards = new Cards(scene);
        this.hostUserAvatars = new HostUserAvatarsAroundTableGame(this.scene);
    }

    create() {
        super.create();
        this.hostUserAvatars.createOnRoomData();
        this.hostUserAvatars.moveToEdgeOfTable();
        const screenCenter = getScreenCenter(this.scene);
        this.cards.create(screenCenter.x, screenCenter.y);
        this.cards.setDepth(10);
        this.changeState(new Shuffling(this));
    }

    update() {
        super.update();
    }

}