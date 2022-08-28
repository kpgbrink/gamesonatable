import { PlayerCardHandState } from "api/src/playerState/playerStates/PlayerCardHandState";
import { transformFromObject } from "../../../../../objects/Tools";
import { CardGameUserAvatarContainer } from "../../../../../objects/userAvatarContainer/CardGameUserAvatarContainer";
import { HostUserAvatarsAroundTableGame } from "../../../HostUserAvatars/HostUserAvatarsAroundTable/HostUserAvatarsAroundTableGame";
import { HostCardGame } from "../../HostCardGame";
import { HostGameState } from "../HostGameState";
import { Dealing } from "./Dealing";


// Bring cards to the random dealer and have the cards start going out to people.
export class BringCardsToDealer<
    PlayerStateType extends PlayerCardHandState,
    UserAvatarsType extends HostUserAvatarsAroundTableGame<UserAvatarType>,
    UserAvatarType extends CardGameUserAvatarContainer<PlayerStateType>> extends HostGameState<PlayerStateType> {

    hostGame: HostCardGame<PlayerStateType, UserAvatarsType, UserAvatarType>;
    getReadyToDealTime: number = .2;

    constructor(hostGame: HostCardGame<PlayerStateType, UserAvatarsType, UserAvatarType>) {
        super(hostGame);
        this.hostGame = hostGame;
    }

    enter() {
        console.log('enter has run');
        this.hostGame.setNextDealer();
        console.log('dealer set', this.hostGame.currentDealerId);
        // set the current user turn to null
        this.hostGame.currentPlayerTurnId = null;
        // start moving cards to random dealer
        this.startMovingCardsToDealer();
    }

    startMovingCardsToDealer() {
        const dealer = this.hostGame.getDealer();
        const positionRotation = transformFromObject(dealer, { x: 0, y: 150, rotation: 0, scale: 1 });
        this.hostGame.cards.cardContainers.forEach(cardContainer => {
            cardContainer.startMovingOverTimeTo(positionRotation, this.getReadyToDealTime);
        });
    }

    update(time: number, delta: number): HostGameState<PlayerStateType> | null {
        this.hostGame.cards.update(time, delta);
        // check if all cards are in the dealer
        if (this.hostGame.cards.cardContainers.every(cardContainer =>
            cardContainer.moveOnDuration === null
        )) {
            return new Dealing(this.hostGame);
        }
        return null;
    }

    exit() {
    }
}