import { PlayerData } from "api/src/playerData/PlayerData";
import { HostGame } from "../../HostGame";

export abstract class HostGameState<PlayerDataType extends PlayerData> {
    hostGame: HostGame<PlayerDataType>;

    constructor(hostGame: HostGame<PlayerDataType>) {
        this.hostGame = hostGame;
    }

    onItemMoveToTable() {

    }

    abstract enter(): void;

    abstract update(time: number, delta: number): void;

    abstract exit(): void;
}