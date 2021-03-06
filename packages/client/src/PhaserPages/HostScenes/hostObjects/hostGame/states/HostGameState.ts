import { HostGame } from "../../HostGame";

export abstract class HostGameState {
    hostGame: HostGame;

    constructor(hostGame: HostGame) {
        this.hostGame = hostGame;
    }

    onItemMoveToTable() {

    }

    abstract enter(): void;

    abstract update(time: number, delta: number): void;

    abstract exit(): void;
}