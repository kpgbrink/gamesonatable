import { HostCardGame } from "./HostCardGame";


export class ThirtyOneGame extends HostCardGame {
    dealAmount: number = 3;

    update(time: number, delta: number) {
        super.update(time, delta);
    }

}