import { MainMenuGameData, PlayerMainMenuData } from "api/src/data/datas/MainMenuData";
import MenuButton from "../../objects/MenuButton";
import { persistentData } from "../../objects/PersistantData";
import { getScreenDimensions } from "../../objects/Tools";
import PlayerStartingScene from "../PlayerStartingScene";
import { PlayerDataHandler } from "./PlayerDataHandler";


export default class PlayerMenu extends PlayerDataHandler<PlayerMainMenuData, MainMenuGameData> {
    selectGameButton: MenuButton | null = null;

    backButton: MenuButton | null = null;

    playerData: PlayerMainMenuData;
    gameData: MainMenuGameData;
    scene: PlayerStartingScene;


    constructor(scene: PlayerStartingScene) {
        super();
        this.scene = scene;
        this.playerData = new PlayerMainMenuData();
        this.gameData = new MainMenuGameData();
    }

    create() {
        super.create();
        this.addSelectGameButton();
        this.addBackButton();

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

    addBackButton() {
        this.backButton = new MenuButton(150, 100, this.scene);
        this.backButton.setText("Back");
        this.backButton?.setVisible(false);
        this.backButton.on('pointerdown', () => {
            this.gameData.mainMenuPosition = 0;
            this.backButton?.setVisible(false);
            this.sendData();
        });
        this.scene.add.existing(this.backButton);
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
        const mainMenuPosition0 = gameData.mainMenuPosition === 0;
        this.selectGameButton?.setVisible(mainMenuPosition0);
        if (mainMenuPosition0) {
            this.scene.userAvatarContainer?.setPosition(getScreenDimensions(this.scene).width / 2, getScreenDimensions(this.scene).height / 2);
            this.scene.userAvatarContainer?.setScale(1);
            (() => {
                if (this.scene.nameFormElement === null) return;
                this.scene.nameFormElement.x = getScreenDimensions(this.scene).width / 2;
                this.scene.nameFormElement.y = 150;
                this.scene.nameFormElement.setScale(1);
            })()
        }

        // if the main menu position is 1, show the choose game button.
        const mainMenuPosition1 = gameData.mainMenuPosition === 1;
        this.backButton?.setVisible(mainMenuPosition1);
        if (mainMenuPosition1) {
            this.scene.userAvatarContainer?.setPosition(150, 500);
            this.scene.userAvatarContainer?.setScale(.6);
            (() => {
                if (this.scene.nameFormElement === null) return;
                this.scene.nameFormElement.x = 150;
                this.scene.nameFormElement.y = 250;
                this.scene.nameFormElement.setScale(.5);
            })()
        }

    }

    update(time: number, delta: number) {

    }
}