import { ThirtyOnePlayerCardHandData } from "api/src/playerData/playerDatas/specificPlayerCardHandDatas/ThirtyOnePlayerCardHandData";
import { CountdownTimer } from "../../../../../../objects/CountdownTimer";
import { ThirtyOneGame } from "../../../ThirtyOneGame";
import { HostGameState } from "../../HostGameState";

// Bring cards to the random dealer and have the cards start going out to people.
export class ThirtyOneGameEnd extends HostGameState<ThirtyOnePlayerCardHandData> {
    hostGame: ThirtyOneGame;
    bringShownCardToPositionTime: number = 1;

    timeBackToGameChooseScreen: number = 12;
    // timer for starting the next round
    timerBackToGameChooseScreen: CountdownTimer = new CountdownTimer(this.timeBackToGameChooseScreen);

    constructor(hostGame: ThirtyOneGame) {
        super(hostGame);
        this.hostGame = hostGame;
    }

    enter() {

    }

    update(time: number, delta: number): HostGameState<ThirtyOnePlayerCardHandData> | null {
        this.hostGame.cards.update(time, delta);
        this.timerBackToGameChooseScreen.update(delta);
        if (this.timerBackToGameChooseScreen.isDone()) {
            console.log('timer is done game is done');
            // set url back to home screen
            this.hostGame.setUrlToHomeScreen();
        }
        return null;
    }

    exit() {
    }
}