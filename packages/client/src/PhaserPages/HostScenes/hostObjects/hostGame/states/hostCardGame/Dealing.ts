import { PlayerCardHandState } from "api/src/playerState/playerStates/PlayerCardHandState";
import { CountdownTimer } from "../../../../../objects/CountdownTimer";
import { CardGameUserAvatarContainer } from "../../../../../objects/userAvatarContainer/CardGameUserAvatarContainer";
import { HostUserAvatarsAroundTableGame } from "../../../HostUserAvatars/HostUserAvatarsAroundTable/HostUserAvatarsAroundTableGame";
import { HostCardGame } from "../../HostCardGame";
import { HostGameState } from "../HostGameState";

export class Dealing<
    UserAvatars extends HostUserAvatarsAroundTableGame<UserAvatarType>,
    UserAvatarType extends CardGameUserAvatarContainer<PlayerCardHandState>> extends HostGameState {

    hostGame: HostCardGame<UserAvatars, UserAvatarType>;
    // store the countdown timer for the movement of the card and the card that is moving
    nextCardTimer: CountdownTimer = new CountdownTimer(.1);
    sendingOutCardTime: number = .7;

    currentPlayerGettingCard: string | null = null;

    constructor(hostGame: HostCardGame<UserAvatars, UserAvatarType>) {
        super(hostGame);
        this.hostGame = hostGame;
    }

    enter() {
        // set the cards in the center of the table

    }

    getNextCardDeal(delta: number) {
        // get the next card to deal
        this.nextCardTimer.update(delta);
        if (this.nextCardTimer.wasDone()) {
            this.sendOutCard();
            this.nextCardTimer.start();
            return;
        }
    }

    sendOutCard() {
        // get the player that the card is going to
        if (this.hostGame.currentDealerId === null) {
            throw new Error('currentDealerId is null');
        }
        this.currentPlayerGettingCard ??= this.hostGame.currentDealerId;
        this.currentPlayerGettingCard = this.hostGame.getNextPlayerId(this.currentPlayerGettingCard);

        // check count of cards dealt to player.
        if (this.hostGame.getPlayerCards(this.currentPlayerGettingCard).length >= this.hostGame.dealAmount) {
            return;
        }

        // get top card container that is not set to a player yet
        const cardContainer = this.hostGame.cards.getTopFaceDownCard();
        if (!cardContainer) {
            throw new Error('no card container');
        }
        cardContainer.setUserHand(this.currentPlayerGettingCard, this.hostGame.scene.time.now);

        // get the player that the card is going to
        const userContainer = this.hostGame.getUser(this.currentPlayerGettingCard);
        if (!userContainer) {
            throw new Error('user is null');
        }

        this.hostGame.sendUserState(this.currentPlayerGettingCard);
        // });
        // check if every player in game has the amount of cards they need
        if (this.hostGame.hostUserAvatars?.getUsersInGame().every(userAvatar => {
            return this.hostGame.getPlayerCards(userAvatar.user.id)?.length === this.hostGame.dealAmount;
        })) {
            this.hostGame.changeState(this.hostGame.createGameState());
        }
    }

    update(time: number, delta: number): HostGameState | null {
        this.getNextCardDeal(delta);
        this.hostGame.cards.update(time, delta);

        return null;
    }

    exit() {
        // on exit
    }
}