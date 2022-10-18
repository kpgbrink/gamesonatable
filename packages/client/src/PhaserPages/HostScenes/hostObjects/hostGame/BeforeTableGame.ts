import { BeforeTableGameData, PlayerBeforeTableGameData } from "api/src/data/datas/BeforeTableGameData";
import socket from "../../../../SocketConnection";
import { persistentData } from "../../../objects/PersistantData";
import { playersInRoom } from "../../../objects/Tools";
import HostBeforeTableGameScene from "../../HostBeforeTableGameScene";
import { HostGame } from "../HostGame";
import { HostUserAvatarsAroundTableSelectPosition } from "../HostUserAvatars/HostUserAvatarsAroundTable/HostUserAvatarsAroundTableSelectPosition";


export class BeforeTableGame extends HostGame<PlayerBeforeTableGameData, BeforeTableGameData> {
    scene: HostBeforeTableGameScene;
    gameData: BeforeTableGameData;

    hostUserAvatars: HostUserAvatarsAroundTableSelectPosition | null = null;

    constructor(scene: HostBeforeTableGameScene) {
        super(scene);
        this.scene = scene;
        this.gameData = new BeforeTableGameData();
    }

    preload() {
        super.preload();
    }

    create() {
        super.create();
        this.createHostUserAvatarsAroundTableGame();
    }

    createHostUserAvatarsAroundTableGame() {
        this.hostUserAvatars = new HostUserAvatarsAroundTableSelectPosition(this.scene);
        this.hostUserAvatars.createOnRoomData();
        this.hostUserAvatars.moveToEdgeOfTable();
        console.log('this.hostUserAvatars.userAvatarContainers', this.hostUserAvatars.userAvatarContainers);
        console.log('amount', this.hostUserAvatars.userAvatarContainers.length);
        this.hostUserAvatars.userAvatarContainers.forEach(player => {
            player.create();
            player.depth = 100;
        });
    }

    update(time: number, delta: number) {
        super.update(time, delta);
        this.hostUserAvatars?.update(time, delta);
        this.moveUsersToOutsideTable();
    }

    moveUsersToOutsideTable() {
        this.hostUserAvatars?.moveToEdgeOfTable();
        this.hostUserAvatars?.userAvatarContainers.forEach((userAvatar) => {
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
            // userAvatar.rotation += DegreesToRadians(180);
        });
    }

    // ------------------------------------ Data ------------------------------------
    override onPlayerDataReceived(userId: string, playerData: Partial<PlayerBeforeTableGameData>, gameData: Partial<BeforeTableGameData> | null): void {
        super.onPlayerDataReceived(userId, playerData, gameData);
        // update ready on the player
        // update ready on the avatar
        console.log('playerData', playerData);
        const avatar = this.hostUserAvatars?.userAvatarContainers.find((avatar) => avatar.user.id === userId);
        console.log('avatar', avatar);
        if (!avatar) return;
        avatar.setReady();
        this.startGameIfAllReady();
    }

    override getPlayerDataToSend(userId: string): Partial<PlayerBeforeTableGameData> | undefined {
        // get the player data from userId
        const playerData = this.hostUserAvatars?.userAvatarContainers.find((avatar) => avatar.user.id === userId)?.beforeTableGamePlayerData;
        if (!playerData) return;
        console.log('player ready', playerData.ready);
        return {
            ready: playerData.ready,
        };
    }

    startGameIfAllReady() {
        // If all users are ready then start the game
        const allReady = this.hostUserAvatars?.userAvatarContainers.every((avatar) => avatar.beforeTableGamePlayerData.ready);
        console.log('allReady', allReady);
        if (allReady) {
            this.startGame();
        }
    }

    startGame() {
        // All users in game
        const playersInGame = playersInRoom(persistentData.roomData);
        if (playersInGame.length === 0) return;
        socket.emit('start game', playersInGame);
        // set the players in game to be the players in the room
        persistentData.roomData?.users.forEach(user => {
            user.inGame = true;
        });
        this.scene.goToNextScene();
    }


    // ------------------------------------ Data End ------------------------------------  // TODO remove this
} 