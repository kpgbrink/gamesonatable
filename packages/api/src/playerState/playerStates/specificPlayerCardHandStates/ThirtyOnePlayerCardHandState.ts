import { PlayerCardHandState } from "../PlayerCardHandState";

export class ThirtyOnePlayerCardHandState extends PlayerCardHandState {
    canKnock: boolean = false;

    canTakeCard: boolean = false;

    canReturnCard: boolean = false;
}