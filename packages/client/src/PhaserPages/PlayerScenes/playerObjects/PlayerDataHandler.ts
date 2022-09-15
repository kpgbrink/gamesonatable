import { GameData, PlayerData } from "api/src/data/Data";
import socket from "../../../SocketConnection";

export abstract class
    PlayerDataHandler
    <PlayerDataType extends PlayerData,
        GameDataType extends GameData>
{
    abstract playerData: PlayerDataType;
    abstract gameData: GameDataType;

    create() {
        this.listenForGameData();
        this.listenForPlayerData();
        this.listenForData();
    }

    // PlayerData --------------------
    abstract getPlayerDataToSend(): Partial<PlayerDataType> | undefined;

    abstract onPlayerDataReceived(playerData: Partial<PlayerDataType>, gameData: Partial<GameDataType> | null): void;

    listenForPlayerData() {
        socket.on("playerDataToUser", (playerData: Partial<PlayerDataType>) => {
            this.onPlayerDataReceived(playerData, null);
        });
    }

    sendPlayerData() {
        console.log('user data being sent to Host', this.getPlayerDataToSend());
        socket.emit("playerDataToHost", this.getPlayerDataToSend());
    }

    requestPlayerData() {
        socket.emit("getPlayerData");
    }

    // GameData --------------------
    abstract getGameDataToSend(): Partial<GameDataType> | undefined;

    abstract onGameDataReceived(gameData: Partial<GameDataType>, playerData: Partial<PlayerDataType> | null): void;

    listenForGameData() {
        socket.on("gameDataToUser", (gameData: Partial<GameDataType>) => {
            this.onGameDataReceived(gameData, null);
        });
    }

    sendGameData(updateGameData: boolean = false) {
        console.log('game data being sent', this.getGameDataToSend());
        socket.emit("gameDataToHost", this.getGameDataToSend(), updateGameData);
    }

    requestGameData() {
        socket.emit("getGameData");
    }
    // Data --------------------
    getData(): [Partial<GameDataType> | undefined, Partial<PlayerDataType> | undefined] {
        return [this.getGameDataToSend(), this.getPlayerDataToSend()];
    }

    listenForData() {
        socket.on("dataToUser", (gameData: Partial<GameDataType>, playerData: Partial<PlayerDataType>) => {
            this.onGameDataReceived(gameData, playerData);
            this.onPlayerDataReceived(playerData, gameData);
        });
    }

    sendData(updateGameData: boolean = false) {
        // my user id  
        console.log('data being sent', this.getData());
        socket.emit("dataToHost", this.getGameDataToSend(), this.getPlayerDataToSend(), updateGameData);
    }

    requestData() {
        socket.emit("getData");
    }

    // --- end data ---

}