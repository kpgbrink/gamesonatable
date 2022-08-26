import { PlayerCardHandState } from "../PlayerCardHandState";

export class ThirtyOnePlayerCardHandState extends PlayerCardHandState {
    canTonk: boolean = false;
    canTakeCard: boolean = false;
    canReturnCard: boolean = false;
}