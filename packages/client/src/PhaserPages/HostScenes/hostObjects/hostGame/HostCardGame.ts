import { Cards } from "../../../objects/Cards";
import { getScreenCenter } from "../../../objects/Tools";
import { HostGame } from "../HostGame";
import { HostUserAvatarsAroundTableGame } from "../HostUserAvatars/HostUserAvatarsAroundTable/HostUserAvatarsAroundTableGame";
import { Shuffling } from "./states/hostCardGame/Shuffling";
import { HostGameState } from "./states/HostGameState";

// construction of HostGameState interface
export interface HostGameStateConstructor {
    new(hostGame: HostCardGame): HostGameState;
}

export abstract class HostCardGame extends HostGame {
    scene: Phaser.Scene;
    cards: Cards;
    hostUserAvatars: HostUserAvatarsAroundTableGame | null = null;
    dealAmount: number = 10;
    currentDealerId: string | null = null;

    abstract gameStartStateConstructor: HostGameStateConstructor;

    constructor(scene: Phaser.Scene) {
        super(scene);
        this.scene = scene;
        this.cards = new Cards(scene);
    }

    getDealer() {
        if (!this.currentDealerId) throw new Error('No dealer set');
        const dealer = this.hostUserAvatars?.getUserById(this.currentDealerId);
        if (!dealer) throw new Error('No dealer found');
        return dealer;
    }

    randomizeDealer() {
        // choose a random dealer
        this.currentDealerId = this.hostUserAvatars?.getRandomUserId() || null;
    }

    nextDealer() {
        if (!this.currentDealerId) {
            this.randomizeDealer();
            return;
        }
        this.currentDealerId = this.hostUserAvatars?.getNextUserIdFromRotation(this.currentDealerId) || null;
    }

    getNextPlayerId(playerId: string) {
        if (!this.hostUserAvatars) {
            throw new Error('Not made');
        }
        return this.hostUserAvatars.getNextUserIdFromRotation(playerId);
    }

    create() {
        super.create();
        this.hostUserAvatars = new HostUserAvatarsAroundTableGame(this.scene);
        this.hostUserAvatars.createOnRoomData();
        this.hostUserAvatars.moveToEdgeOfTable();
        const screenCenter = getScreenCenter(this.scene);
        this.cards.create(screenCenter.x, screenCenter.y);
        this.changeState(new Shuffling(this));
    }

    update(time: number, delta: number) {
        super.update(time, delta);
    }

    getUser(userId: string) {
        return this.hostUserAvatars?.getUserById(userId);
    }

    getPlayerCards(userId: string) {
        return this.cards.getPlayerCards(userId);
    }

    getTableCards() {
        return this.cards.getTableCards();
    }

}