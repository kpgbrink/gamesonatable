import { PlayerState } from "api/src/playerState/PlayerState";
import socket from "../../../SocketConnection";
import { persistentData } from "../../objects/PersistantData";
import { HostGameState } from "./hostGame/states/HostGameState";

export abstract class HostGame<PlayerStateType extends PlayerState> {
    abstract sendUserStateString: string;
    scene: Phaser.Scene;
    currentState: HostGameState<PlayerStateType> | null = null;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    preload() {
    }

    create() {

    }

    abstract createGameState(): HostGameState<PlayerStateType>;

    // override this
    // this sends the user whole state so that if a user refreshes the page they can continue the game
    // switch from send state to update state override things
    sendUserState(userId: string) {
        socket.emit(this.sendUserStateString, userId, this.userState(userId));
    }

    abstract userState(userId: string): Partial<PlayerStateType> | undefined;

    abstract getUserState(): void;

    socketListenForUserState() {
        socket.on("getPlayerState", (userId: string) => {
            console.log("player asking for their state");
            this.sendUserState(userId);
        });
    }

    update(time: number, delta: number) {
        var newState = this.currentState?.update(time, delta) || null;
        this.changeState(newState);
    }

    // the only way I should change the states is by calling this method
    changeState(newState: HostGameState<PlayerStateType> | null) {
        if (!newState) return;
        this.currentState?.exit();
        this.currentState = newState;
        this.currentState.enter();
    }

    // maybe this https://stackoverflow.com/a/68835401/2948122
    setUrlToHomeScreen() {
        // set the url to the home screen
        // change the url using react router
        const { CustomEvent } = window;
        const event = new CustomEvent('changeroute', { detail: `/room/${persistentData.roomData?.room}` });
        window.dispatchEvent(event);
    }
}