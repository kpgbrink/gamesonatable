import { MainMenuGameData, PlayerMainMenuData } from "api/src/data/datas/MainMenuData";
import RoundRectangle from "phaser3-rex-plugins/plugins/roundrectangle";
import ScrollablePanel from "phaser3-rex-plugins/templates/ui/scrollablepanel/ScrollablePanel";
import TextArea from "phaser3-rex-plugins/templates/ui/textarea/TextArea";
import MenuButton from "../../objects/MenuButton";
import { persistentData } from "../../objects/PersistantData";
import { getScreenDimensions } from "../../objects/Tools";
import PlayerStartingScene from "../PlayerStartingScene";
import { PlayerDataHandler } from "./PlayerDataHandler";

const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;


export default class PlayerMenu extends PlayerDataHandler<PlayerMainMenuData, MainMenuGameData> {
    selectGameButton: MenuButton | null = null;

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
        this.addLevelSelecting();

        // this.createScrollablePanel();

        // request data from host
        this.requestData();
    }

    // on scene shutdown
    shutdown() {
        console.log('scene shutdown');
    }

    addLevelSelecting() {
        // add a scrollable list of games
        // var panelConfig: ScrollablePanel.IConfig = {

        // }
        // var panel = new ScrollablePanel(this.scene, );
        // add text game object
        console.log('add level selecting');
        var text = new Phaser.GameObjects.Text(this.scene, 0, 0, "test", { color: 'white', fontSize: '32px' });
        var textArea = new TextArea(this.scene, {
            x: 0, y: 0,
            width: 500,
            orientation: 'x',
            text: text,
            space: { left: 10, right: 10, top: 10, bottom: 25 },
        });
        this.scene.add.existing(textArea);


        var rect = new RoundRectangle(this.scene, 0, 0, 100, 100, 4, 32, 0.5);
        // add rexUI scrollable panel
        var scrollablePanel = new ScrollablePanel(this.scene, {
            x: 0, y: 0,
            width: 500,
            height: 500,
            scrollMode: 0,
            background: rect,
            panel: {
                child: textArea,
                mask: {
                    padding: 1,
                },
            },
            slider: {
                track: rect,
                thumb: rect,
            },
            scroller: {
                threshold: 50,
                slidingDeceleration: 5000,
                backDeceleration: 2000,
            },
            space: {
                left: 10,
                right: 10,
                top: 10,
                bottom: 10,
                panel: 10,
            },
        });

        this.scene.add.existing(scrollablePanel);


        console.log('textArea', textArea);
    }

    addSelectGameButton() {
        const screenDimensions = getScreenDimensions(this.scene);
        this.selectGameButton = new MenuButton(screenDimensions.width / 2, screenDimensions.height - 720, this.scene);
        this.selectGameButton.setText("Select Game");
        this.selectGameButton?.setVisible(false);
        this.selectGameButton.on('pointerdown', () => {
            this.gameData.mainMenuPosition = 1;
            this.selectGameButton?.setVisible(false);
            this.sendData();
        });
        this.selectGameButton.setDepth(1111);
        this.scene.add.existing(this.selectGameButton);
    }

    override getPlayerDataToSend() {
        // Add the data that needs to be sent over.
        const playerData = this.playerData;
        if (persistentData.myUserId === null) return;
        // const userId = persistentData.myUserId;

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
        // console.log('onGameDataReceived', gameData, playerData);
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
        // check if the first player in the list is me.
        // if it is make my controls the first player controls.

    }

    updateMainMenuPosition(gameData: Partial<MainMenuGameData>) {
        // update the main menu position
        if (gameData.mainMenuPosition === undefined) return;
        if (gameData.mainMenuPosition === null) return;
        // if the main menu position is 0, show the select game button.
        // console.log('main menu position', gameData.mainMenuPosition);
        const mainMenuPosition0 = gameData.mainMenuPosition === 0;
        this.selectGameButton?.setVisible(mainMenuPosition0);
        if (mainMenuPosition0) {
            // turn everything back on
            this.scene.nameFormElement?.setVisible(true);
            this.scene.nameFormElement?.setInteractive();
            this.scene.nameFormElement?.setActive(true);
            this.selectGameButton?.setVisible(true);
            this.selectGameButton?.setInteractive();
            this.selectGameButton?.setActive(true);

            window.dispatchEvent(new CustomEvent('showGamesListMenu', { detail: { show: false } }));
        }

        // if the main menu position is 1 then show the gamesListmenu
        if (gameData.mainMenuPosition === 1) {
            // turn off everything on screen
            this.scene.nameFormElement?.setVisible(false);
            this.scene.nameFormElement?.disableInteractive();
            this.scene.nameFormElement?.setActive(false);
            this.selectGameButton?.setVisible(false);
            this.selectGameButton?.disableInteractive();
            this.selectGameButton?.setActive(false);
            // hide full screen button if it is visible

            // make showGamesListMenu event happen
            window.dispatchEvent(new CustomEvent('showGamesListMenu', { detail: { show: true } }));
        }

    }

    update(time: number, delta: number) {

    }
}
