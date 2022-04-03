import { getScreenCenter } from "../../../../../objects/Tools";
import { HostCardGame } from "../../HostCardGame";
import { HostGameState } from "../HostGameState";


export class Dealing extends HostGameState {
    hostGame: HostCardGame;

    constructor(hostGame: HostCardGame) {
        super(hostGame);
        this.hostGame = hostGame;
    }

    enter() {
        const screenCenter = getScreenCenter(this.hostGame.scene);
        // set the cards in the center of the table
        this.hostGame.cards.cardContainers.forEach(cardContainer => {
            cardContainer.x = screenCenter.x;
            cardContainer.y = screenCenter.y;
        });
    }

    update(time: number, delta: number): HostGameState | null {
        // deal the cards then switch to player turn state

        return null;
    }

    exit() {
        // on exit
    }
}