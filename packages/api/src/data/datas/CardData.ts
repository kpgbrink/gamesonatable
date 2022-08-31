import { Data, GameData, PlayerData } from "../Data";

export class PlayerCardHandData extends PlayerData {
    cardIds: number[] = [];
    dealing: boolean = false;
}

export class CardGameData extends GameData {

}

export class CardHandData extends Data {
    playerData = new PlayerCardHandData();
    gameData = new CardGameData();
}