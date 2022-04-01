import { HostGame } from "../../HostGame";

export class HostGameState {
    hostGame: HostGame;

    constructor(hostGame: HostGame) {
        this.hostGame = hostGame;
    }

    enter() {
        throw new Error("Method not implemented.");
    }

    update(): HostGameState | null {
        throw new Error("Method not implemented.");
    }

    exit() {
        throw new Error("Method not implemented.");
    }
}