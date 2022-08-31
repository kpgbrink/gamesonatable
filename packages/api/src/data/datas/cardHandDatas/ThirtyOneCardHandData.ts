import { CardGameData, PlayerCardHandData } from "../CardData";

export class ThirtyOnePlayerCardHandData extends PlayerCardHandData {
    canKnock: boolean = false;

    canTakeCard: boolean = false;

    canReturnCard: boolean = false;
}

export class ThirtyOneCardGameData extends CardGameData {
    knockPlayerId: string | null = null;
}