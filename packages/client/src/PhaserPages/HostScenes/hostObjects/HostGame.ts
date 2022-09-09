import { GameData, PlayerData } from "api/src/data/Data";
import socket from "../../../SocketConnection";
import { persistentData } from "../../objects/PersistantData";
import { HostGameState } from "./hostGame/states/HostGameState";

export abstract class HostGame<PlayerDataType extends PlayerData, GameDataType extends GameData> {
    scene: Phaser.Scene;
    currentState: HostGameState<PlayerDataType, GameDataType> | null = null;
    abstract gameData: GameDataType;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    preload() {
    }

    create() {
        this.listenForGameData();
        this.listenForPlayerData();
        this.listenForData();
        this.socketListenForGetUserStateRequest();
        this.socketListenForGetGameStateRequest();
        this.socketListenForGetDataRequest();
    }

    abstract createGameState(): HostGameState<PlayerDataType, GameDataType>;

    // PlayerData --------------------
    abstract getPlayerData(userId: string): Partial<PlayerDataType> | undefined;

    abstract onPlayerDataToHost(playerData: Partial<PlayerDataType>): void;

    listenForPlayerData() {
        socket.on("playerDataToHost", (playerData: Partial<PlayerDataType>) => {
            this.onPlayerDataToHost(playerData);
        });
    }

    socketListenForGetUserStateRequest() {
        socket.on("getPlayerData", (userId: string) => {
            console.log("player asking for their data");
            this.sendPlayerData(userId);
        });
    }

    sendPlayerData(userId: string) {
        console.log('user data being sent', this.getPlayerData(userId));
        socket.emit("playerDataToUser", userId, this.getPlayerData(userId));
    }

    // GameData --------------------
    abstract getGameData(): Partial<GameDataType> | undefined;

    abstract onGameDataToHost(gameData: Partial<GameDataType>): void;

    listenForGameData() {
        socket.on("gameDataToHost", (gameData: Partial<GameDataType>) => {
            this.onGameDataToHost(gameData);
        });
    }

    socketListenForGetGameStateRequest() {
        socket.on("getGameData", (userId: string) => {
            console.log("player asking for game data");
            this.sendGameData(userId);
        });
    }

    sendGameData(userId: string | null = null) {
        console.log('game data being sent', this.getGameData());
        socket.emit("gameDataToUser", userId, this.getGameData());
    }
    // Data --------------------
    getData(userId: string): [Partial<GameDataType> | undefined, Partial<PlayerDataType> | undefined] {
        return [this.getGameData(), this.getPlayerData(userId)];
    }

    listenForData() {
        socket.on("dataToHost", (gameData: Partial<GameDataType>, playerData: Partial<PlayerDataType>) => {
            this.onGameDataToHost(gameData);
            this.onPlayerDataToHost(playerData);
        });
    }

    socketListenForGetDataRequest() {
        socket.on("getData", (userId: string) => {
            console.log("player asking for data");
            this.sendData(userId);
        });
    }

    sendData(userId: string) {
        console.log('data being sent', this.getData(userId));
        socket.emit("dataToUser", userId, this.getGameData(), this.getPlayerData(userId));
    }

    // --- end data ---
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