import { RoomData, UserBeforeGameStartDataDictionary } from "api";
import socket from "../../SocketConnection";
import MenuButton from "../tools/objects/MenuButton";
import { persistentData } from "../tools/objects/PersistantData";
import { addFullScreenButton, DegreesToRadians, getScreenCenter, loadIfImageNotLoaded, loadIfSpriteSheetNotLoaded } from "../tools/objects/Tools";
import UserAvatarContainer from "../tools/objects/UserAvatarContainer";
import HostScene from "./tools/HostScene";

export default class HostBeforeGameStart extends HostScene {
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
    }

    addUsers(roomData: RoomData) {
        // Create a user avatar for each user
        roomData?.users.forEach((user) => {
            if (!user.userAvatar) return;
            if (user.isHost) return;
            if (this.userAvatars.find((userAvatar) => userAvatar.user.id === user.id)) return;
            const onSizeChange = (userAvatarContainer: UserAvatarContainer) => {
                userAvatarContainer.setInteractive({ useHandCursor: true });
                this.input.setDraggable(userAvatarContainer);
            };
            const screenCenter = getScreenCenter(this);
            // TODO put then in the correct rotation if rotation is set
            const userAvatarContainer = new UserAvatarContainer(this, screenCenter.x + Math.random() - .5, screenCenter.y + Math.random() - .5, user, onSizeChange);
            // if the rotation is already set then set the location to the correct rotation
            if (user.rotation) {
                userAvatarContainer.rotation = user.rotation;
                userAvatarContainer.x = screenCenter.x + (850 * Math.cos(user.rotation + DegreesToRadians(90)));
                userAvatarContainer.y = screenCenter.y + (850 * Math.sin(user.rotation + DegreesToRadians(90)));
            }

            this.add.existing(userAvatarContainer);
            this.userAvatars.push(userAvatarContainer);
            userAvatarContainer.on('pointerover', () => {
                userAvatarContainer?.bodyImage?.setTint(0x44ff44);
                userAvatarContainer?.baseImage?.setTint(0x44ff44);
                userAvatarContainer?.legsImage?.setTint(0x44ff44);
            });
            userAvatarContainer.on('pointerout', () => {
                userAvatarContainer?.bodyImage?.clearTint();
                userAvatarContainer?.baseImage?.clearTint();
                userAvatarContainer?.legsImage?.clearTint();
            });
        });
        // Remove any user avatars that are no longer in the room
        this.userAvatars.forEach((userAvatar) => {
            if (roomData?.users.find((user) => user.id === userAvatar.user.id)) return;
            userAvatar.destroy();
            this.userAvatars.splice(this.userAvatars.indexOf(userAvatar), 1);
        });
        addFullScreenButton(this);
    }

    create() {
        super.create();
        socket.emit('set player current scene', 'PlayerBeforeGameStart');
        this.setUpStartGameButtonAndInstructionText();
        this.onRoomDataUpdateInstructionsOrStartGameButton(persistentData.roomData);
        socket.on('room data', (roomData: RoomData) => {
            this.addUsers(roomData);
            this.onRoomDataUpdateInstructionsOrStartGameButton(roomData);
            this.startGameIfAllUsersReady();
        });
        this.input.on('drag', (pointer: any, gameObject: any, dragX: number, dragY: number) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
            this.setStartGameButton();
        });
        socket.emit('get room data');
        const screenCenter = getScreenCenter(this);
        this.add.circle(screenCenter.x, screenCenter.y, 850, 0xffffff);
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
        console.log(Object.keys(this.userBeforeGameStartDictionary).length, this.userAvatars.length);
        const allNonHostUsers = this.userAvatars.filter((userAvatar) => !userAvatar.user.isHost);
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
        this.instructionText = this.add.text(screenCenter.x, screenCenter.y - 100, 'Drag your avatar to your starting position!', {
            fontFamily: 'Arial',
            fontSize: '80px',
            color: '#000',
            align: 'center',
            stroke: '#014714',
            strokeThickness: 5,
            wordWrap: { width: 1000, useAdvancedWrap: true },
        }).setOrigin(0.5).setDepth(1);
        this.startGameButton = new MenuButton(screenCenter.x, screenCenter.y, this);
        this.startGameButton.on('pointerdown', this.startGame);
        this.startGameButton.setText('Start game');
        this.add.existing(this.startGameButton);
        this.instructionText.setVisible(false);
        this.startGameButton.setVisible(false);
    }

    startGame() {
        console.log('start game');
        socket.emit('start game');
    }

    onRoomDataUpdateInstructionsOrStartGameButton(roomData: RoomData | null) {
        if (!roomData) return;
        // Check if all of the rotations are already set. And if they are do not show the instruction text.
        const allRotationsSet = this.userAvatars.every((userAvatar) => userAvatar.user.rotation);
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
        const screenCenter = getScreenCenter(this);
        // slowly move user avatars to edge of table
        this.userAvatars.forEach((userAvatar) => {
            // calculate distance from center
            const distanceFromCenter = Math.sqrt(Math.pow(userAvatar.x - screenCenter.x, 2) + Math.pow(userAvatar.y - screenCenter.y, 2));
            // increase distance from center to make it to the outside of circle
            const distanceFromCenterToOutside = Math.min(distanceFromCenter + 8, 850);
            // calculate angle from center to user avatar
            const angleFromCenterToUserAvatar = Math.atan2(userAvatar.y - screenCenter.y, userAvatar.x - screenCenter.x);
            // calculate new x and y position
            const newX = screenCenter.x + distanceFromCenterToOutside * Math.cos(angleFromCenterToUserAvatar);
            const newY = screenCenter.y + distanceFromCenterToOutside * Math.sin(angleFromCenterToUserAvatar);
            // move user avatar to new position
            userAvatar.x = newX;
            userAvatar.y = newY;
            // rotate user avatar to face the center
            userAvatar.rotation = angleFromCenterToUserAvatar - DegreesToRadians(90);
            // update the avatar rotations to server if changed
            // but don't make the update send things out to everyone else because it doesn't really matter to the others atm.
            (() => {
                const user = persistentData.roomData?.users.find((user) => user.id === userAvatar.user.id);
                if (!user) return;
                if (user.rotation === userAvatar.rotation) return;
                socket.emit('set player rotation', userAvatar.user.id, userAvatar.rotation);
                user.rotation = userAvatar.rotation;
            })();
            // If user is ready then rotate the user
            if (this.userBeforeGameStartDictionary[userAvatar.user.id]?.ready) {
                userAvatar.rotation += DegreesToRadians(180);
            }
        });
    }

}
