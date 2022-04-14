import { HostCardGame, HostGameStateConstructor } from "./HostCardGame";
import { ThirtyOneGameStart } from "./states/hostCardGame/gameSpecificStates/ThirtyOneGameStart";


export class ThirtyOneGame extends HostCardGame {
    dealAmount: number = 3;

    gameStartStateConstructor: HostGameStateConstructor = ThirtyOneGameStart;


    update(time: number, delta: number) {
        super.update(time, delta);
    }

}