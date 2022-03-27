import { RoomData, UserBeforeGameStartDataDictionary } from "api";
import socket from "../../SocketConnection";
import MenuButton from "../tools/objects/MenuButton";
import { persistentData } from "../tools/objects/PersistantData";
import { addFullScreenButton, DegreesToRadians, distanceBetweenTwoPoints, getAverageRadians, getScreenCenter, loadIfImageNotLoaded, loadIfSpriteSheetNotLoaded, playersInRoomm, pow2, quadraticFormula } from "../tools/objects/Tools";
import UserAvatarContainer from "../tools/objects/UserAvatarContainer";
import HostScene from "./tools/HostScene";

export default class HostBeforeGameStart extends HostScene {
    userAvatars: UserAvatarContainer[] = [];
    instructionText: Phaser.GameObjects.Text | null;
    startGameButton: MenuButton | null;
    userBeforeGameStartDictionary: UserBeforeGameStartDataDictionary;
    tableHeight = 1700;
    tableWidth = 1776;
    tableOvalWidth = 1632 - 310;

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

    addUsers(roomData: RoomData) {
        // Create a user avatar for each user
        roomData?.users.forEach((user) => {
            if (!user.userAvatar) return;
            if (user.isHost) return;
            // Don't recreate a user avatar if it already exists
            if (this.userAvatars.find((userAvatar) => userAvatar.user.id === user.id)) return;
            const onSizeChange = (userAvatarContainer: UserAvatarContainer) => {
                userAvatarContainer.setInteractive({ useHandCursor: true });
                this.input.setDraggable(userAvatarContainer);
            };
            const screenCenter = getScreenCenter(this);
            const userAvatarContainer = new UserAvatarContainer(this, screenCenter.x + Math.random() - .5, screenCenter.y + Math.random() - .5, user, onSizeChange);
            // if the rotation is already set then set the location to the correct rotation
            if (user.rotation) {
                // userAvatarContainer.tableRotation = user.rotation;
                console.log('set rotation!!!!', user.rotation);
                userAvatarContainer.x = screenCenter.x + (2000 * Math.cos(user.rotation));
                userAvatarContainer.y = screenCenter.y + (2000 * Math.sin(user.rotation));
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
        // Make the table
        const screenCenter = getScreenCenter(this);
        this.add.image(screenCenter.x, screenCenter.y, 'table');
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
        this.startGameButton.on('pointerdown', this.startGame);
        this.startGameButton.setText('Start game');
        this.add.existing(this.startGameButton);
        this.instructionText.setVisible(false);
        this.startGameButton.setVisible(false);
    }

    startGame() {
        console.log('start game');
        // All users in game
        const playersInGame = playersInRoomm(persistentData.roomData);
        if (playersInGame.length === 0) return;
        socket.emit('start game', playersInGame);
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
        const screenCenter = getScreenCenter(this);
        // slowly move user avatars to edge of table
        this.userAvatars.forEach((userAvatar) => {
            // calculate distance from center
            const distanceFromCenter = Math.sqrt(Math.pow(userAvatar.x - screenCenter.x, 2) + Math.pow(userAvatar.y - screenCenter.y, 2));

            // calculate angle from center to user avatar
            const angleFromCenterToUserAvatar = Math.atan2(userAvatar.y - screenCenter.y, userAvatar.x - screenCenter.x);

            const tableHalfHeight = this.tableHeight / 2;
            const tableHalfWidth = this.tableWidth / 2;
            const tableHalfOvalWidth = this.tableOvalWidth / 2;
            // Calculate max distance
            const { maxDistance, userAvatarAngle } = (() => {
                const distanceSideWall = Math.abs(tableHalfWidth / Math.cos(angleFromCenterToUserAvatar));
                const distanceTopWall = Math.abs(tableHalfHeight / Math.sin(angleFromCenterToUserAvatar));
                if (distanceTopWall < distanceSideWall) {
                    // Check if the user avatar is in the top or bottom half of the table
                    if (userAvatar.y > screenCenter.y) {
                        // User avatar is in the top half of the table
                        const facingStraightDownDirection = Math.PI / 2
                        return {
                            maxDistance: distanceTopWall,
                            userAvatarAngle: getAverageRadians([angleFromCenterToUserAvatar, facingStraightDownDirection, facingStraightDownDirection])
                        };
                    } else {
                        // User avatar is in the bottom half of the table
                        const facingStraightUpDirection = -Math.PI / 2
                        return {
                            maxDistance: distanceTopWall,
                            userAvatarAngle: getAverageRadians([angleFromCenterToUserAvatar, facingStraightUpDirection, facingStraightUpDirection])
                            // userAvatarAngle: -Math.PI / 2,
                        };
                    }
                }
                // calculate height from hypotenuse and adjacent
                const heightOpposite = Math.sqrt(Math.abs(Math.pow(distanceSideWall, 2) - Math.pow(tableHalfWidth, 2)));

                // add distance of the circle at the height
                const a = pow2(Math.tan(angleFromCenterToUserAvatar)) + ((1 / 4) * pow2(this.tableHeight)) / pow2(tableHalfOvalWidth);
                const b = 2 * heightOpposite * Math.tan(angleFromCenterToUserAvatar);
                const c = pow2(heightOpposite) - 1 / 4 * pow2(this.tableHeight);
                const xLocations = quadraticFormula(a, b, c);
                const equation = (x: number) => {
                    return Math.tan(angleFromCenterToUserAvatar) * x + heightOpposite;
                }
                const getDistance = (x: number) => {
                    const y = equation(x);
                    const distance = distanceBetweenTwoPoints(x, y, 0, heightOpposite);
                    return distance;
                };
                const distance = Math.min(getDistance(xLocations[0]), getDistance(xLocations[1]));
                return { maxDistance: distanceSideWall + distance, userAvatarAngle: angleFromCenterToUserAvatar };
            })();
            // increase distance from center to make it to the outside of circle
            const distanceFromCenterToOutside = Math.min(distanceFromCenter + 8, maxDistance);
            // calculate new x and y position
            const newX = screenCenter.x + distanceFromCenterToOutside * Math.cos(angleFromCenterToUserAvatar);
            const newY = screenCenter.y + distanceFromCenterToOutside * Math.sin(angleFromCenterToUserAvatar);
            // move user avatar to new position
            userAvatar.x = newX;
            userAvatar.y = newY;
            userAvatar.tableRotation = angleFromCenterToUserAvatar;
            // rotate user avatar to face the center
            userAvatar.rotation = userAvatarAngle + Math.PI / 2;
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
