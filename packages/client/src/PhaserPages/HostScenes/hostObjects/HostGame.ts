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
    getPlayerDataToSend(userId: string): Partial<PlayerDataType> | undefined {
        return this.currentState?.getPlayerDataToSend(userId);
    }

    // override this
    onPlayerDataReceived(userId: string, playerData: Partial<PlayerDataType>, gameData: Partial<GameDataType> | null) {
        this.currentState?.onPlayerDataReceived(userId, playerData, gameData);
    }

    listenForPlayerData() {
        socket.on("playerDataToHost", (userId, playerData: Partial<PlayerDataType>) => {
            this.onPlayerDataReceived(userId, playerData, null);
        });
    }

    socketListenForGetUserStateRequest() {
        socket.on("getPlayerData", (userId: string) => {
            console.log("player asking for their data");
            this.sendPlayerData(userId);
        });
    }

    sendPlayerData(userId: string, playerData: Partial<PlayerDataType> | undefined = undefined) {
        // console.log('user data being sent', this.getPlayerDataToSend(userId));
        const playerDataToSend = playerData || this.getPlayerDataToSend(userId);
        socket.emit("playerDataToUser", userId, playerDataToSend);
    }

    // GameData --------------------

    getGameDataToSend(): Partial<GameDataType> | undefined {
        return this.currentState?.getGameDataToSend();
    }

    // Override this
    onGameDataReceived(userId: string, gameData: Partial<GameDataType>, playerData: Partial<PlayerDataType> | null, updateGameData: boolean) {
        this.currentState?.onGameDataReceived(userId, gameData, playerData, updateGameData);
    }

    listenForGameData() {
        socket.on("gameDataToHost", (userId: string, gameData: Partial<GameDataType>, updateGameData: boolean) => {
            this.onGameDataReceived(userId, gameData, null, updateGameData);
        });
    }

    socketListenForGetGameStateRequest() {
        socket.on("getGameData", (userId: string) => {
            // console.log("player asking for game data");
            this.sendGameData(userId);
        });
    }

    sendGameData(userId: string | null = null, gameData: Partial<GameDataType> | undefined = undefined) {
        console.log('game data being sent', this.getGameDataToSend());
        const gameDataToSend = gameData || this.getGameDataToSend();
        socket.emit("gameDataToUser", userId, gameDataToSend);
    }
    // Data --------------------

    listenForData() {
        socket.on("dataToHost", (userId: string, gameData: Partial<GameDataType>, playerData: Partial<PlayerDataType>, updateGameData: boolean) => {
            this.onGameDataReceived(userId, gameData, playerData, updateGameData);
            this.onPlayerDataReceived(userId, playerData, gameData);
        });
    }

    socketListenForGetDataRequest() {
        socket.on("getData", (userId: string) => {
            console.log("player asking for data");
            this.sendData(userId);
        });
    }

    sendData(userId: string, gameData: Partial<GameDataType> | undefined = undefined, playerData: Partial<PlayerDataType> | undefined = undefined) {
        console.log('data being sent', this.getGameDataToSend(), this.getPlayerDataToSend(userId));
        const gameDataToSend = gameData || this.getGameDataToSend();
        const playerDataToSend = playerData || this.getPlayerDataToSend(userId);
        socket.emit("dataToUser", userId, gameDataToSend, playerDataToSend);
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