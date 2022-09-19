import { CardGameData, PlayerCardHandData } from "../CardData";

export class ThirtyOnePlayerCardHandData extends PlayerCardHandData {
}

export class ThirtyOneCardGameData extends CardGameData {
    knockPlayerId: string | null = null;
    thirtyOnePlayerId: string | null = null;
}