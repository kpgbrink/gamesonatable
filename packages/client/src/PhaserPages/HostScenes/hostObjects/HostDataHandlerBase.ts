import { GameData, PlayerData } from "api/src/data/Data";
import socket from "../../../SocketConnection";

export abstract class HostDataHandlerBase<PlayerDataType extends PlayerData, GameDataType extends GameData> {

    create() {
        this.listenForGameData();
        this.listenForPlayerData();
        this.listenForData();
        this.socketListenForGetUserStateRequest();
        this.socketListenForGetGameStateRequest();
        this.socketListenForGetDataRequest();
    }

    destroy() {
        socket.off("playerDataToHost");
        socket.off("gameDataToHost");
        socket.off("dataToHost");
        socket.off("getPlayerData");
        socket.off("getGameData");
        socket.off("getData");
    }

    // PlayerData --------------------
    abstract getPlayerDataToSend(userId: string): Partial<PlayerDataType> | undefined;

    // override this
    abstract onPlayerDataReceived(userId: string, playerData: Partial<PlayerDataType>, gameData: Partial<GameDataType> | null): void

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

    abstract getGameDataToSend(): Partial<GameDataType> | undefined;

    // Override this
    abstract onGameDataReceived(userId: string, gameData: Partial<GameDataType>, playerData: Partial<PlayerDataType> | null, updateGameData: boolean): void

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
        // console.log('game data being sent', this.getGameDataToSend());
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
            // console.log("player asking for data");
            this.sendData(userId);
        });
    }

    sendData(userId: string, gameData: Partial<GameDataType> | undefined = undefined, playerData: Partial<PlayerDataType> | undefined = undefined) {
        // console.log('data being sent', this.getGameDataToSend(), this.getPlayerDataToSend(userId));
        const gameDataToSend = gameData || this.getGameDataToSend();
        const playerDataToSend = playerData || this.getPlayerDataToSend(userId);
        socket.emit("dataToUser", userId, gameDataToSend, playerDataToSend);
    }

    // --- end data ---
}