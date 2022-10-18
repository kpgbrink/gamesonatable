import { GameData, PlayerData } from "api/src/data/Data";
import { persistentData } from "../../objects/PersistantData";
import { HostDataHandler } from "./HostDataHandler";
import { HostGameState } from "./hostGame/states/HostGameState";

export abstract class HostGame<PlayerDataType extends PlayerData, GameDataType extends GameData>
    extends HostDataHandler<PlayerDataType, GameDataType> {
    scene: Phaser.Scene;
    currentState: HostGameState<PlayerDataType, GameDataType> | null = null;
    abstract gameData: GameDataType;

    constructor(scene: Phaser.Scene) {
        super();
        this.scene = scene;
    }

    preload() {
    }

    create() {
        super.create();
    }

    // PlayerData --------------------
    getPlayerDataToSend(userId: string): Partial<PlayerDataType> | undefined {
        return this.currentState?.getPlayerDataToSend(userId);
    }

    onPlayerDataReceived(userId: string, playerData: Partial<PlayerDataType>, gameData: Partial<GameDataType> | null) {
        this.currentState?.onPlayerDataReceived(userId, playerData, gameData);
    }

    // GameData --------------------
    getGameDataToSend(): Partial<GameDataType> | undefined {
        return this.currentState?.getGameDataToSend();
    }

    onGameDataReceived(userId: string, gameData: Partial<GameDataType>, playerData: Partial<PlayerDataType> | null, updateGameData: boolean) {
        this.currentState?.onGameDataReceived(userId, gameData, playerData, updateGameData);
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