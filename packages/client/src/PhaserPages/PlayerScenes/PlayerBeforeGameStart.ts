import { UserBeforeGameStartDataDictionary } from "api";
import socket from "../../SocketConnection";
import MenuButton from "../objects/MenuButton";
import { addUserNameText, getScreenDimensions, loadIfSpriteSheetNotLoaded, makeMyUserAvatarInCenterOfPlayerScreen } from "../objects/Tools";
import { loadUserAvatarSprites } from "../objects/UserAvatarContainer";
import PlayerScene from "./playerObjects/PlayerScene";

export default class PlayerBeforeGameStart extends PlayerScene {
    readyButton: MenuButton | null;
    waitingForPlayersText: Phaser.GameObjects.Text | null;

    constructor() {
        super({ key: 'PlayerBeforeGameStart' });
        this.readyButton = null;
        this.waitingForPlayersText = null;
    }

    preload() {
        loadIfSpriteSheetNotLoaded(this, 'fullscreen', 'assets/ui/fullscreen.png', { frameWidth: 64, frameHeight: 64 });
        loadIfSpriteSheetNotLoaded(this, 'fullscreen-white', 'assets/ui/fullscreen-white.png', { frameWidth: 64, frameHeight: 64 });
    }

    create() {
        super.create();
        addUserNameText(this);
        loadUserAvatarSprites(this);
        makeMyUserAvatarInCenterOfPlayerScreen(this);
        this.addReadyButton();
        this.checkIfIAmReady();
        this.addInstructions();
    }

    addInstructions() {
        var screenDimensions = getScreenDimensions(this);
        this.add.text(100, screenDimensions.height / 3, 'Drag your player on the other screen to yourself!',
            {
                color: 'green',
                fontSize: '50px',
                wordWrap: { width: 800, useAdvancedWrap: true }
            });
    }

    checkIfIAmReady() {
        socket.on('userBeforeGameStart data', (userBeforeGameStartDictionary: UserBeforeGameStartDataDictionary) => {
            // if my user is ready
            if (userBeforeGameStartDictionary[socket.id]?.ready) {
                this.showWaitingForPlayersText();
            } else {
                this.showReadyButton();
            }
        });
    }

    showReadyButton() {
        this.readyButton?.setVisible(true);
        this.waitingForPlayersText?.setVisible(false);
    }

    showWaitingForPlayersText() {
        this.readyButton?.setVisible(false);
        this.waitingForPlayersText?.setVisible(true);
    }

    addReadyButton() {
        const screenDimensions = getScreenDimensions(this);
        this.readyButton = new MenuButton(screenDimensions.width / 2, screenDimensions.height - 200, this);
        this.waitingForPlayersText = this.add.text(screenDimensions.width / 2, screenDimensions.height - 200, 'Waiting for other players to be ready', { color: 'orange', fontSize: '50px ' }).setOrigin(0.5);
        this.waitingForPlayersText.setVisible(false);
        this.readyButton.setText('Ready?');
        this.readyButton.on('pointerdown', () => {
            this.showWaitingForPlayersText();
            socket.emit('ready');
        });
        this.add.existing(this.readyButton);
    }

    update() {

    }
}


