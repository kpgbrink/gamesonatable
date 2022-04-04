import { Cards } from "../../../objects/Cards";
import { getScreenCenter } from "../../../objects/Tools";
import { HostGame } from "../HostGame";
import { HostUserAvatarsAroundTableGame } from "../HostUserAvatars/HostUserAvatarsAroundTable/HostUserAvatarsAroundTableGame";
import { Shuffling } from "./states/hostCardGame/Shuffling";


export class HostCardGame extends HostGame {
    cards: Cards
    scene: Phaser.Scene
    hostUserAvatars: HostUserAvatarsAroundTableGame;
    dealAmount: number = 10;
    currentDealerId: string | null = null;

    constructor(scene: Phaser.Scene) {
        super(scene);
        this.scene = scene;
        this.cards = new Cards(scene);
        this.hostUserAvatars = new HostUserAvatarsAroundTableGame(this.scene);
    }

    getDealer() {
        if (!this.currentDealerId) throw new Error('No dealer set');
        const dealer = this.hostUserAvatars.getUserById(this.currentDealerId);
        if (!dealer) throw new Error('No dealer found');
        return dealer;
    }

    randomizeDealer() {
        // choose a random dealer
        this.currentDealerId = this.hostUserAvatars.getRandomUserId();
    }

    nextDealer() {
        if (!this.currentDealerId) {
            this.randomizeDealer();
            return;
        }
        this.currentDealerId = this.hostUserAvatars.getNextUserIdFromRotation(this.currentDealerId);
    }

    create() {
        super.create();
        this.hostUserAvatars.createOnRoomData();
        this.hostUserAvatars.moveToEdgeOfTable();
        const screenCenter = getScreenCenter(this.scene);
        this.cards.create(screenCenter.x, screenCenter.y);
        this.changeState(new Shuffling(this));
    }

    update(time: number, delta: number) {
        super.update(time, delta);
    }

}