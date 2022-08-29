// This is what is sent to the client/ server when a player is dealt a card

import { PlayerData } from "../PlayerData";

export class PlayerCardHandData extends PlayerData {
    cardIds: number[] = [];
    dealing: boolean = false;
}