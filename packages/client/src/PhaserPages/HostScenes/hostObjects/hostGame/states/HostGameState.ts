import { PlayerState } from "api/src/playerState/PlayerState";
import { HostGame } from "../../HostGame";

export abstract class HostGameState<PlayerStateType extends PlayerState> {
    hostGame: HostGame<PlayerStateType>;

    constructor(hostGame: HostGame<PlayerStateType>) {
        this.hostGame = hostGame;
    }

    onItemMoveToTable() {

    }

    abstract enter(): void;

    abstract update(time: number, delta: number): void;

    abstract exit(): void;
}