import { GameData, PlayerData } from "api/src/data/Data";
import socket from "../../../SocketConnection";
import { persistentData } from "../../objects/PersistantData";
import { HostGameState } from "./hostGame/states/HostGameState";

export abstract class HostGame<PlayerDataType extends PlayerData, GameDataType extends GameData> {
    scene: Phaser.Scene;
    currentState: HostGameState<PlayerDataType, GameDataType> | null = null;
    gameData: GameDataType;

    constructor(scene: Phaser.Scene, gameData: GameDataType) {
        this.scene = scene;
        this.gameData = gameData;
    }

    preload() {
    }

    create() {
        this.socketListenForGetUserStateRequest();
        this.socketListenForGetGameStateRequest();
    }

    abstract createGameState(): HostGameState<PlayerDataType, GameDataType>;


    // PlayerData
    sendPlayerData(userId: string) {
        console.log('user state being sent', this.getPlayerData(userId));
        socket.emit("playerDataToUser", userId, this.getPlayerData(userId));
    }

    abstract getPlayerData(userId: string): Partial<PlayerDataType> | undefined;

    abstract listenForPlayerData(): void;

    socketListenForGetUserStateRequest() {
        socket.on("getPlayerData", (userId: string) => {
            console.log("player asking for their state");
            this.sendPlayerData(userId);
        });
    }

    // GameData
    sendGameData(userId: string | null = null) {
        console.log('game state being sent', this.getGameData());
        socket.emit("gameDataToAll", userId, this.getGameData());
    }

    abstract getGameData(): Partial<GameDataType> | undefined;

    abstract listenForGameData(): void;

    socketListenForGetGameStateRequest() {
        socket.on("getGameData", (userId: string) => {
            console.log("player asking for game state");
            this.sendGameData(userId);
        });
    }

    // gets both of the data and sends it to the server
    socketListenForGetDataRequest() {
        socket.on("getData", (userId: string) => {
            console.log("player asking for data");
            socket.emit("data", userId, this.getGameData(), this.getPlayerData(userId));
        });
    }

    update(time: number, delta: number) {
        var newState = this.currentState?.update(time, delta) || null;
        this.changeState(newState);
    }

    // the only way I should change the states is by calling this method
    changeState(newState: HostGameState<PlayerDataType, GameDataType> | null) {
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