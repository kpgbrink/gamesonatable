import { GameData, PlayerData } from "../Data";

export class PlayerCardHandData extends PlayerData {
    pickUpTo: number | null = null;
    dropTo: number | null = null;
    pickUpFaceDownCardIds: number[] = [];
    pickUpFaceUpCardIds: number[] = [];
    cardIds: number[] = [];
    dealing: boolean = false;
}

export class CardGameData extends GameData {
    playerDealerId: string | null = null;
    playerTurnId: string | null = null;
    turn: number = 0;
    startDealing: boolean = false;
}
