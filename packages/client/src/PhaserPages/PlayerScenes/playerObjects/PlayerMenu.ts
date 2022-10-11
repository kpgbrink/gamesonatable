import { MainMenuGameData, PlayerMainMenuData } from "api/src/data/datas/MainMenuData";
import RoundRectangle from "phaser3-rex-plugins/plugins/roundrectangle";
import ScrollablePanel from "phaser3-rex-plugins/templates/ui/scrollablepanel/ScrollablePanel";
import TextArea from "phaser3-rex-plugins/templates/ui/textarea/TextArea";
import { gamesList } from "../../objects/gamesList";
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
        this.selectGameButton = new MenuButton(screenDimensions.width / 2, 300, this.scene);
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
            window.dispatchEvent(new CustomEvent('showGamesListMenu', { detail: { show: false } }));

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
        // const mainMenuPosition1 = gameData.mainMenuPosition === 1;
        // this.backButton?.setVisible(mainMenuPosition1);
        // if (mainMenuPosition1) {
        //     this.scene.userAvatarContainer?.setPosition(getScreenDimensions(this.scene).width / 2, 150);
        //     this.scene.userAvatarContainer?.setScale(.4);
        //     (() => {
        //         if (this.scene.nameFormElement === null) return;
        //         this.scene.nameFormElement.x = getScreenDimensions(this.scene).width / 2;
        //         this.scene.nameFormElement.y = 20;
        //         this.scene.nameFormElement.setScale(.5);
        //     })()
        // }
        // if the main menu position is 1 then show the gamesListmenu
        if (gameData.mainMenuPosition === 1) {
            // make showGamesListMenu event happen
            window.dispatchEvent(new CustomEvent('showGamesListMenu', { detail: { show: true } }));
        }

    }

    createScrollablePanel() {
        if (this.scene.rexUI === undefined) {
            throw new Error('rexUI is undefined');
        }
        const screenDimensions = getScreenDimensions(this.scene);
        const scrollablePanelHeight = 1200;
        var scrollablePanel = this.scene.rexUI.add.scrollablePanel({
            x: screenDimensions.width / 2,
            y: screenDimensions.height - scrollablePanelHeight / 2,
            width: screenDimensions.width,
            height: scrollablePanelHeight,

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


        // create thing showing currently selected game and a button to start the game
        // add a panel for the game currently selected
        const panelHeight = 340;
        this.scene.rexUI?.add.roundRectangle(screenDimensions.width / 2, screenDimensions.height - scrollablePanelHeight - panelHeight / 2 - 5, screenDimensions.width, panelHeight, 20, COLOR_PRIMARY);
        const panelText = this.scene.add.text(screenDimensions.width / 2, screenDimensions.height - scrollablePanelHeight - panelHeight / 1.1, 'Selected Game Text');
        panelText.setOrigin(.5, .5);
        panelText.setAlign('center');
        panelText.setFontSize(50);
        panelText.setWordWrapWidth(screenDimensions.width - 20);
        // add description text
        const descriptionText = this.scene.add.text(screenDimensions.width / 2, screenDimensions.height - scrollablePanelHeight - panelHeight / 1.1 + 50, 'Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur. Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint obcaecat cupiditat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. ');
        descriptionText.setOrigin(.5, 0);
        descriptionText.setFontSize(30);
        descriptionText.setWordWrapWidth(screenDimensions.width - 20);
        // add start game button
        const startGameButton = new MenuButton(screenDimensions.width / 1.2, screenDimensions.height - scrollablePanelHeight - panelHeight / 6, this.scene);
        startGameButton.setInteractive();
        startGameButton.setText('Start Game');
        startGameButton.setStyle({
            fontSize: '30px',
            strockeThickness: 2,
        });
        startGameButton.setDepth(111);
        this.scene.add.existing(startGameButton);
        // startGameButton.setDepth(1111);
        startGameButton.on('pointerdown', () => {
            // try to start the game 
            console.log('try to start the game');
        });

        scrollablePanel
            .setChildrenInteractive({
            })
            .on('child.click', function (child: any, pointer: any, event: any) {
                // find the game in games list that matches the text
                const game = gamesList.find(game => game.displayName === child.text);
                if (game === undefined) {
                    throw new Error('game is undefined');
                }
                panelText.text = game.displayName;
                descriptionText.text = game.description;
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
    gamesList.forEach(game => {
        if (scene.rexUI === undefined) {
            throw new Error('rexUI is undefined');
        }
        sizer.add(scene.rexUI.add.label({
            width: 250, height: 200,

            background: scene.rexUI?.add.roundRectangle(0, 0, 0, 0, 14, COLOR_LIGHT),
            text: scene.add.text(0, 0, `${game.displayName}`, {
                fontSize: game.playerMenuFontSize
                // fontSize: 'fit'
            }),

            align: 'center',
            space: {
                left: 10,
                right: 10,
                top: 10,
                bottom: 10,
            }
        }));
    });

    return sizer;
}
