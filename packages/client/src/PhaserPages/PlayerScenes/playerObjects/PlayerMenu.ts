import { MainMenuGameData, PlayerMainMenuData } from "api/src/data/datas/MainMenuData";
import MenuButton from "../../objects/MenuButton";
import { persistentData } from "../../objects/PersistantData";
import { getScreenDimensions } from "../../objects/Tools";
import { PlayerDataHandler } from "./PlayerDataHandler";
import PlayerScene from "./PlayerScene";


export default class PlayerMenu extends PlayerDataHandler<PlayerMainMenuData, MainMenuGameData> {
    selectGameButton: MenuButton | null = null;

    playerData: PlayerMainMenuData;
    gameData: MainMenuGameData;
    scene: PlayerScene;


    constructor(scene: PlayerScene) {
        super();
        this.scene = scene;
        this.playerData = new PlayerMainMenuData();
        this.gameData = new MainMenuGameData();
    }

    create() {
        super.create();
        this.addSelectGameButton();

        // request data from host
        this.requestData();
    }

    addSelectGameButton() {
        const screenDimensions = getScreenDimensions(this.scene);
        this.selectGameButton = new MenuButton(screenDimensions.width / 2, screenDimensions.height - 200, this.scene);
        this.selectGameButton.setText("Select Game");
        this.selectGameButton?.setVisible(false);
        this.selectGameButton.on('pointerdown', () => {
            this.gameData.mainMenuPosition = 1;
            this.selectGameButton?.setVisible(false);
            this.sendData();
        });
        this.scene.add.existing(this.selectGameButton);
    }

    override getPlayerDataToSend() {
        // Add the data that needs to be sent over.
        const playerData = this.playerData;
        if (persistentData.myUserId === null) return;
        const userId = persistentData.myUserId;

        return playerData;
    }

    override onPlayerDataReceived(playerData: Partial<PlayerMainMenuData>, gameData: Partial<MainMenuGameData> | null): void {
        if (!playerData) return;
        if (playerData === undefined) return;

        this.playerData = { ...this.playerData, ...playerData };

        this.updateSuggestedGameSelected(this.playerData);
    }

    updateSuggestedGameSelected(playerData: Partial<PlayerMainMenuData>) {
        if (playerData.suggestedGameSelected === undefined) return;
        if (playerData.suggestedGameSelected === null) return;
    }

    override getGameDataToSend() {
        const gameData = this.gameData;
        return gameData;
    }

    override onGameDataReceived(gameData: Partial<MainMenuGameData>, playerData: Partial<PlayerMainMenuData> | null): void {
        console.log('onGameDataReceived', gameData, playerData);
        this.updateMainMenuPosition(gameData);
        this.updatePlayerList(gameData);
        this.updateFirtPlayerTakeable(gameData);
    }

    updateFirtPlayerTakeable(gameData: Partial<MainMenuGameData>) {
        if (gameData.firstPlayerTakeable === undefined) return;
        if (gameData.firstPlayerTakeable === null) return;
        // if the first player is takeable, show the button to take it.

    }
    updatePlayerList(gameData: Partial<MainMenuGameData>) {
        // update the player list
        if (gameData.playerList === undefined) return;
        if (gameData.playerList === null) return;
        // check if the first player in the list is me.
        // if it is make my controls the first player controls.

    }

    updateMainMenuPosition(gameData: Partial<MainMenuGameData>) {
        // update the main menu position
        if (gameData.mainMenuPosition === undefined) return;
        if (gameData.mainMenuPosition === null) return;
        // if the main menu position is 0, show the select game button.
        console.log('main menu position', gameData.mainMenuPosition);
        this.selectGameButton?.setVisible(gameData.mainMenuPosition === 0);

        // if the main menu position is 1, show the choose game button.

    }

    update(time: number, delta: number) {

    }
}