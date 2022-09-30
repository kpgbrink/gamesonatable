import { GameData, PlayerData } from "../Data";

export class PlayerMainMenuData extends PlayerData {
    suggestedGameSelected: string | null = null;
}

export class MainMenuGameData extends GameData {

    // 0 is the joining thing. 1 is the choosing which game to play.
    mainMenuPosition: number = 0;

    suggestedGames: string[] = [];
    playerList: string[] | null = null;
    firstPlayerTakeable: boolean = false;
    gameChosen: string | null = null;
}
