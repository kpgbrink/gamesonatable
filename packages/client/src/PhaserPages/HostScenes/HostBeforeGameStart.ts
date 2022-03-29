import { RoomData, UserBeforeGameStartDataDictionary } from "api";
import socket from "../../SocketConnection";
import MenuButton from "../tools/objects/MenuButton";
import { persistentData } from "../tools/objects/PersistantData";
import { DegreesToRadians, getScreenCenter, loadIfImageNotLoaded, loadIfSpriteSheetNotLoaded, playersInRoomm } from "../tools/objects/Tools";
import UserAvatarContainer from "../tools/objects/UserAvatarContainer";
import HostScene from "./tools/HostScene";
import { addUserAvatars, createTable, moveUserAvatarToProperTableLocation, UserAvatarScene } from "./tools/HostTools";

export default class HostBeforeGameStart extends HostScene implements UserAvatarScene {
    userAvatars: UserAvatarContainer[] = [];
    instructionText: Phaser.GameObjects.Text | null;
    startGameButton: MenuButton | null;
    userBeforeGameStartDictionary: UserBeforeGameStartDataDictionary;

    constructor() {
        super({ key: 'HostBeforeGameStart' });
        this.instructionText = null;
        this.startGameButton = null;
        this.userBeforeGameStartDictionary = {};
    }

    preload() {
        loadIfSpriteSheetNotLoaded(this, 'fullscreen', 'assets/ui/fullscreen.png', { frameWidth: 64, frameHeight: 64 });
        loadIfSpriteSheetNotLoaded(this, 'fullscreen-white', 'assets/ui/fullscreen-white.png', { frameWidth: 64, frameHeight: 64 });
        loadIfImageNotLoaded(this, 'checkmark', 'assets/ui/checkmark.png');
        loadIfImageNotLoaded(this, 'table', 'assets/TableScaled.png');
    }

    create() {
        super.create();
        socket.emit('set player current scene', 'PlayerBeforeGameStart');
        this.setUpStartGameButtonAndInstructionText();
        this.onRoomDataUpdateInstructionsOrStartGameButton(persistentData.roomData);
        socket.on('room data', (roomData: RoomData) => {
            const onSizeChange = (userAvatarContainer: UserAvatarContainer) => {
                userAvatarContainer.setInteractive({ useHandCursor: true });
                this.input.setDraggable(userAvatarContainer);
            };
            addUserAvatars(this, roomData, onSizeChange);
            this.onRoomDataUpdateInstructionsOrStartGameButton(roomData);
            this.startGameIfAllUsersReady();
        });
        this.input.on('drag', (pointer: any, gameObject: any, dragX: number, dragY: number) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
            this.setStartGameButton();
        });
        socket.emit('get room data');
        // Make the table
        createTable(this);
        this.setUpUserReady();
    }

    setUpUserReady() {
        socket.emit('userBeforeGameStart data', this.userBeforeGameStartDictionary);
        socket.on('ready', (userId: string) => {
            // add user to dictionary
            if (!this.userBeforeGameStartDictionary[userId]) {
                this.userBeforeGameStartDictionary[userId] = { ready: true };
            } else {
                this.userBeforeGameStartDictionary[userId].ready = true;
            }
            socket.emit('userBeforeGameStart data', this.userBeforeGameStartDictionary);
            // Add a checkmark to the user avatar container
            const userAvatarContainer = this.userAvatars.find((userAvatar) => userAvatar.user.id === userId);
            if (!userAvatarContainer) return;
            const checkmark = this.add.image(0, 0, 'checkmark');
            checkmark.setScale(.2);
            userAvatarContainer.add(checkmark);
            this.startGameIfAllUsersReady();
        });
    }

    startGameIfAllUsersReady() {
        this.removeUsersWhoDoNotExist();
        // If all users are ready then start the game
        const allNonHostUsers = playersInRoomm(persistentData.roomData);
        console.log(Object.keys(this.userBeforeGameStartDictionary).length, allNonHostUsers.length);
        if (Object.keys(this.userBeforeGameStartDictionary).length === allNonHostUsers.length) {
            this.startGame();
        }
    }

    removeUsersWhoDoNotExist() {
        // Remove users from dictionary if they don't exist in the room
        Object.keys(this.userBeforeGameStartDictionary).forEach((userId) => {
            if (!this.userAvatars.find((userAvatar) => userAvatar.user.id === userId)) {
                delete this.userBeforeGameStartDictionary[userId];
            }
        });
    }

    setUpStartGameButtonAndInstructionText() {
        // Create both the instruction text and the start game button
        const screenCenter = getScreenCenter(this);
        this.instructionText = this.add.text(screenCenter.x, screenCenter.y - 50, 'Drag your avatar to your starting position!', {
            fontFamily: 'Arial',
            fontSize: '80px',
            color: '#000',
            align: 'center',
            stroke: '#014714',
            strokeThickness: 5,
            wordWrap: { width: 1000, useAdvancedWrap: true },
        }).setOrigin(0.5).setDepth(1);
        this.startGameButton = new MenuButton(screenCenter.x, screenCenter.y, this);
        this.startGameButton.on('pointerdown', () => this.startGame());
        this.startGameButton.setText('Start game');
        this.add.existing(this.startGameButton);
        this.instructionText.setVisible(false);
        this.startGameButton.setVisible(false);
    }

    startGame() {
        // All users in game
        const playersInGame = playersInRoomm(persistentData.roomData);
        if (playersInGame.length === 0) return;
        socket.emit('start game', playersInGame);
        socket.emit('set player current scene', persistentData.roomData?.selectedGame);
        if (!persistentData.roomData?.selectedGame) return;
        this.scene.start(persistentData.roomData?.selectedGame);
    }

    onRoomDataUpdateInstructionsOrStartGameButton(roomData: RoomData | null) {
        if (!roomData) return;
        // Check if all of the rotations are already set. And if they are do not show the instruction text.
        const allRotationsSet = playersInRoomm(roomData).every((user) => user.rotation);
        console.log('allRotationsSet', roomData.users);
        if (allRotationsSet) {
            // Do not show the start game button if previously was not showing it.
            if (!this.instructionText?.visible) {
                this.setStartGameButton();
            }
        } else {
            this.setInstructionText();
        }
    }

    setInstructionText() {
        this.startGameButton?.setVisible(false);
        this.instructionText?.setVisible(true);
    }

    setStartGameButton() {
        this.startGameButton?.setVisible(true);
        this.instructionText?.setVisible(false);
    }

    update() {
        // slowly move user avatars to edge of table
        moveUserAvatarToProperTableLocation(this);
        this.userAvatars.forEach((userAvatar) => {
            // update the avatar rotations to server if changed
            // but don't make the update send things out to everyone else because it doesn't really matter to the others atm.
            (() => {
                const user = persistentData.roomData?.users.find((user) => user.id === userAvatar.user.id);
                if (!user) return;
                if (user.rotation === userAvatar.tableRotation) return;
                socket.emit('set player rotation', userAvatar.user.id, userAvatar.tableRotation);
                user.rotation = userAvatar.tableRotation;
            })();
            // If user is ready then rotate the user
            if (this.userBeforeGameStartDictionary[userAvatar.user.id]?.ready) {
                userAvatar.rotation += DegreesToRadians(180);
            }
        });
    }
}
