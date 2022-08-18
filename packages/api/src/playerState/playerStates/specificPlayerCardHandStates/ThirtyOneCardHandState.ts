import { PlayerCardHandState } from "../PlayerCardHandState";

export class ThirtyOneCardHandState extends PlayerCardHandState {
    canTonk: boolean = false;
    canTakeCard: boolean = false;
    canReturnCard: boolean = false;
}