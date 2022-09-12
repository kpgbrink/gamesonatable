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
    abstract getPlayerData(): Partial<PlayerDataType> | undefined;

    abstract onPlayerDataToUser(playerData: Partial<PlayerDataType>, gameData: Partial<GameDataType> | null): void;

    listenForPlayerData() {
        socket.on("playerDataToUser", (playerData: Partial<PlayerDataType>) => {
            this.onPlayerDataToUser(playerData, null);
        });
    }

    sendPlayerData() {
        console.log('user data being sent to Host', this.getPlayerData());
        socket.emit("playerDataToHost", this.getPlayerData());
    }

    requestPlayerData() {
        socket.emit("getPlayerData");
    }

    // GameData --------------------
    abstract getGameData(): Partial<GameDataType> | undefined;

    abstract onGameDataToUser(gameData: Partial<GameDataType>, playerData: Partial<PlayerDataType> | null): void;

    listenForGameData() {
        socket.on("gameDataToUser", (gameData: Partial<GameDataType>) => {
            this.onGameDataToUser(gameData, null);
        });
    }

    sendGameData() {
        console.log('game data being sent', this.getGameData());
        socket.emit("gameDataToHost", this.getGameData());
    }

    requestGameData() {
        socket.emit("getGameData");
    }
    // Data --------------------
    getData(): [Partial<GameDataType> | undefined, Partial<PlayerDataType> | undefined] {
        return [this.getGameData(), this.getPlayerData()];
    }

    listenForData() {
        socket.on("dataToUser", (gameData: Partial<GameDataType>, playerData: Partial<PlayerDataType>) => {
            this.onGameDataToUser(gameData, playerData);
            this.onPlayerDataToUser(playerData, gameData);
        });
    }

    sendData() {
        // my user id  
        console.log('data being sent', this.getData());
        socket.emit("dataToHost", this.getGameData(), this.getPlayerData());
    }

    requestData() {
        socket.emit("getData");
    }

    // --- end data ---

}