import { RoomData } from "api";
import socket from "../../SocketConnection";
import GameTable from "../objects/GameTable";
import { persistentData } from "../objects/PersistantData";
import { getScreenCenter, loadIfImageNotLoaded, loadIfSpriteSheetNotLoaded, playersInRoom } from "../objects/Tools";
import { BeforeTableGame } from "./hostObjects/hostGame/BeforeTableGame";
import HostScene from "./hostObjects/HostScene";

export default class HostBeforeTableGameScene extends HostScene {
    playerSceneKey: string = "PlayerBeforeTableGameStart";
    instructionText: Phaser.GameObjects.Text | null;
    gameTable: GameTable | null = null;
    // hostUserAvatars: HostUserAvatarsAroundTableSelectPosition | null;
    beforeTableGame: BeforeTableGame = new BeforeTableGame(this);

    constructor() {
        super({ key: 'HostBeforeTableGameScene' });
        this.instructionText = null;
        // this.hostUserAvatars = null;
    }

    preload() {
        loadIfSpriteSheetNotLoaded(this, 'fullscreen', 'assets/ui/fullscreen.png', { frameWidth: 64, frameHeight: 64 });
        loadIfSpriteSheetNotLoaded(this, 'fullscreen-white', 'assets/ui/fullscreen-white.png', { frameWidth: 64, frameHeight: 64 });
        loadIfImageNotLoaded(this, 'checkmark', 'assets/ui/checkmark.png');
        loadIfImageNotLoaded(this, 'table', 'assets/TableScaled.png');
        this.beforeTableGame.preload();
    }

    create() {
        super.create();
        // this.hostUserAvatars = new HostUserAvatarsAroundTableSelectPosition(this);
        // this.hostUserAvatars.createUsers(persistentData.roomData);
        socket.on('room data', (roomData: RoomData) => {
            // this.hostUserAvatars?.createUsers(roomData);
            // this.startGameIfAllUsersReady();
        });
        socket.emit('get room data');
        // this.setUpUserReady();
        const screenCenter = getScreenCenter(this);
        this.gameTable = new GameTable(this, screenCenter.x, screenCenter.y);
        this.gameTable.setDepth(-1);
        this.beforeTableGame.create();
    }

    // setUpUserReady() {
    //     socket.emit('userBeforeGameStart data', this.userBeforeGameStartDictionary);
    //     socket.on('ready', (userId: string) => {
    //         // add user to dictionary
    //         if (!this.userBeforeGameStartDictionary[userId]) {
    //             this.userBeforeGameStartDictionary[userId] = { ready: true };
    //         } else {
    //             this.userBeforeGameStartDictionary[userId].ready = true;
    //         }
    //         socket.emit('userBeforeGameStart data', this.userBeforeGameStartDictionary);
    //         // Add a checkmark to the user avatar container
    //         const userAvatarContainer = this.hostUserAvatars?.userAvatarContainers.find((userAvatarContainer) => userAvatarContainer.user.id === userId);
    //         if (!userAvatarContainer) return;
    //         const checkmark = this.add.image(0, 0, 'checkmark');
    //         checkmark.setScale(.2);
    //         userAvatarContainer.add(checkmark);
    //         this.startGameIfAllUsersReady();
    //     });
    // }

    // startGameIfAllUsersReady() {
    //     this.removeUsersWhoDoNotExist();
    //     // If all users are ready then start the game
    //     const allNonHostUsers = playersInRoom(persistentData.roomData);
    //     if (Object.keys(this.userBeforeGameStartDictionary).length === allNonHostUsers.length) {
    //         this.startGame();
    //     }
    // }

    // removeUsersWhoDoNotExist() {
    //     // Remove users from dictionary if they don't exist in the room
    //     Object.keys(this.userBeforeGameStartDictionary).forEach((userId) => {
    //         if (!this.hostUserAvatars?.userAvatarContainers.find((userAvatarContainer) => userAvatarContainer.user.id === userId)) {
    //             delete this.userBeforeGameStartDictionary[userId];
    //         }
    //     });
    // }

    startGame() {
        // All users in game
        const playersInGame = playersInRoom(persistentData.roomData);
        if (playersInGame.length === 0) return;
        socket.emit('start game', playersInGame);
        // set the players in game to be the players in the room
        persistentData.roomData?.users.forEach(user => {
            user.inGame = true;
        });
        this.goToNextScene();
    }

    update(time: number, delta: number) {
        this.beforeTableGame.update(time, delta);
        // // slowly move user avatars to edge of table
        // this.hostUserAvatars?.moveToEdgeOfTable();
        // this.hostUserAvatars?.userAvatarContainers.forEach((userAvatar) => {
        //     // update the avatar rotations to server if changed
        //     // but don't make the update send things out to everyone else because it doesn't really matter to the others atm.
        //     (() => {
        //         const user = persistentData.roomData?.users.find((user) => user.id === userAvatar.user.id);
        //         if (!user) return;
        //         if (user.rotation === userAvatar.tableRotation) return;
        //         socket.emit('set player rotation', userAvatar.user.id, userAvatar.tableRotation);
        //         user.rotation = userAvatar.tableRotation;
        //     })();
        //     // If user is ready then rotate the user
        //     if (this.userBeforeGameStartDictionary[userAvatar.user.id]?.ready) {
        //         userAvatar.rotation += DegreesToRadians(180);
        //     }
        // });
    }
}
