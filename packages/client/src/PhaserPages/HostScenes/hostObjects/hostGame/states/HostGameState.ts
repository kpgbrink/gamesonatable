import { GameData } from "api/src/gameData/GameData";
import { PlayerData } from "api/src/playerData/PlayerData";
import { HostGame } from "../../HostGame";

export abstract class HostGameState<PlayerDataType extends PlayerData, GameDataType extends GameData> {
    hostGame: HostGame<PlayerDataType, GameDataType>;

    constructor(hostGame: HostGame<PlayerDataType, GameDataType>) {
        this.hostGame = hostGame;
    }

    onItemMoveToTable() {

    }

    abstract enter(): void;

    abstract update(time: number, delta: number): void;

    abstract exit(): void;
}