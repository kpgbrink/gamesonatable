// This is what is sent to the client/ server when a player is dealt a card

import { PlayerState } from "../PlayerState";


export class PlayerCardHandState extends PlayerState {
    cardIds: number[] = [];
    dealing: boolean = false;
}