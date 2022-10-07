import { MainMenuGameData, PlayerMainMenuData } from "api/src/data/datas/MainMenuData";
import RoundRectangle from "phaser3-rex-plugins/plugins/roundrectangle";
import ScrollablePanel from "phaser3-rex-plugins/templates/ui/scrollablepanel/ScrollablePanel";
import TextArea from "phaser3-rex-plugins/templates/ui/textarea/TextArea";
import MenuButton from "../../objects/MenuButton";
import { persistentData } from "../../objects/PersistantData";
import { getScreenDimensions } from "../../objects/Tools";
import PlayerStartingScene from "../PlayerStartingScene";
import { PlayerDataHandler } from "./PlayerDataHandler";
import PlayerScene from "./PlayerScene";

const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;


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
        this.addLevelSelecting();

        this.createScrollablePanel();

        // request data from host
        this.requestData();
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
            this.scene.userAvatarContainer?.setPosition(getScreenDimensions(this.scene).width / 2, 150);
            this.scene.userAvatarContainer?.setScale(.4);
            (() => {
                if (this.scene.nameFormElement === null) return;
                this.scene.nameFormElement.x = getScreenDimensions(this.scene).width / 2;
                this.scene.nameFormElement.y = 20;
                this.scene.nameFormElement.setScale(.5);
            })()
        }

    }

    createScrollablePanel() {
        if (this.scene.rexUI === undefined) {
            throw new Error('rexUI is undefined');
        }
        var scrollablePanel = this.scene.rexUI.add.scrollablePanel({
            x: 1080 / 2,
            y: 1920 / 2,
            width: 500,
            height: 1000,

            scrollMode: 0,

            background: this.scene.rexUI?.add.roundRectangle(0, 0, 2, 2, 10, COLOR_PRIMARY),

            panel: {
                child: createGrid(this.scene),
                mask: {
                    padding: 1,
                }
            },

            slider: {
                track: this.scene.rexUI?.add.roundRectangle(0, 0, 20, 10, 10, COLOR_DARK),
                thumb: this.scene.rexUI?.add.roundRectangle(0, 0, 0, 0, 13, COLOR_LIGHT),
                // position: 'left'
            },

            mouseWheelScroller: {
                focus: false,
                speed: 0.1
            },

            header: this.scene.rexUI?.add.label({
                height: 30,

                orientation: 0,
                background: this.scene.rexUI?.add.roundRectangle(0, 0, 20, 20, 0, COLOR_DARK),
                text: this.scene.add.text(0, 0, 'Header'),
            }),

            footer: this.scene.rexUI?.add.label({
                height: 30,

                orientation: 0,
                background: this.scene.rexUI?.add.roundRectangle(0, 0, 20, 20, 0, COLOR_DARK),
                text: this.scene.add.text(0, 0, 'Footer'),
            }),

            space: {
                left: 10,
                right: 10,
                top: 10,
                bottom: 10,

                panel: 10,
                header: 10,
                footer: 10,
            }
        })
            .layout()

        var print = this.scene.add.text(0, 0, 'Ahhhh ha');

        scrollablePanel
            .setChildrenInteractive({
            })
            .on('child.click', function (child: any, pointer: any, event: any) {
                print.text += `Click ${child.text}\n`;
            })
            .on('child.pressstart', function (child: any, pointer: any, event: any) {
                print.text += `Press ${child.text}\n`;
            })
    }

    update(time: number, delta: number) {

    }
}

var createGrid = function (scene: PlayerScene) {
    if (scene.rexUI === undefined) {
        throw new Error('rexUI is undefined');
    }
    // Create table body
    var sizer = scene.rexUI?.add.fixWidthSizer({
        space: {
            left: 3,
            right: 3,
            top: 3,
            bottom: 3,
            item: 8,
            line: 8,
        },
    })
        .addBackground(scene.rexUI?.add.roundRectangle(0, 0, 20, 20, 0, COLOR_DARK))

    for (var i = 0; i < 30; i++) {
        sizer.add(scene.rexUI.add.label({
            width: 120, height: 120,

            background: scene.rexUI?.add.roundRectangle(0, 0, 0, 0, 14, COLOR_LIGHT),
            text: scene.add.text(0, 0, `${i}`, {
                fontSize: '18'
            }),

            align: 'center',
            space: {
                left: 10,
                right: 10,
                top: 10,
                bottom: 10,
            }
        }));
    }

    return sizer;
}
