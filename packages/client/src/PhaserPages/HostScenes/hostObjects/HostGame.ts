import { PlayerData } from "api/src/playerData/PlayerData";
import socket from "../../../SocketConnection";
import { persistentData } from "../../objects/PersistantData";
import { HostGameState } from "./hostGame/states/HostGameState";

export abstract class HostGame<PlayerDataType extends PlayerData> {
    scene: Phaser.Scene;
    currentState: HostGameState<PlayerDataType> | null = null;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    preload() {
    }

    create() {

    }

    abstract createGameState(): HostGameState<PlayerDataType>;

    sendUserState(userId: string) {
        console.log('user state being sent', this.userState(userId));
        socket.emit("playerDataToUser", userId, this.userState(userId));
    }

    abstract userState(userId: string): Partial<PlayerDataType> | undefined;

    abstract getUserState(): void;

    socketListenForUserState() {
        socket.on("getPlayerData", (userId: string) => {
            console.log("player asking for their state");
            this.sendUserState(userId);
        });
    }

    update(time: number, delta: number) {
        var newState = this.currentState?.update(time, delta) || null;
        this.changeState(newState);
    }

    // the only way I should change the states is by calling this method
    changeState(newState: HostGameState<PlayerDataType> | null) {
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