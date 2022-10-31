import { Game, RoomData } from "api";
import { getGameFromName } from "api/src/gamesList";
import Phaser from "phaser";
import socket from "../../../SocketConnection";
import { persistentData } from "../../objects/PersistantData";
import { socketOffOnSceneShutdown } from "../../objects/Tools";
import { loadUserAvatarSprites } from "../../objects/UserAvatarContainer";


export default abstract class HostScene extends Phaser.Scene {
    abstract playerSceneKey: string;

    create() {
        socket.off();
        // change the game playerSceneKey
        socket.emit('update game', { currentPlayerScene: this.playerSceneKey });
        // if socket disconnects then go to home screen
        socket.on('disconnect', () => {
            // socket disconnected
            console.log('socket disconnected');
            this.setUrlToHomeScreen();
        });

        socket.on("room data", (roomData: RoomData) => {
            // if no player users then go to home screen
            if (roomData.users.length === 0) {
                console.log('no users in room');
                this.setUrlToHomeScreen();
            }
            // start scene if scene is different
            persistentData.roomData = roomData;
        });
        socketOffOnSceneShutdown(this);
        loadUserAvatarSprites(this);
        this.scale.refresh();
        socket.on('restart game', () => {
            // set scene back to first scene in the game scene list
            const gameName = persistentData.roomData?.game.selectedGameName;
            if (!gameName) {
                throw new Error('gameName is null');
            }
            const sceneToStart = getGameFromName(gameName).sceneOrder[0];
            this.scene.start(sceneToStart);
        });
        socket.on('quit game', () => {
            // emit window event to go back to home screen
            this.setUrlToHomeScreen();
        });
    }

    update(time: number, delta: number) {
    }

    goToNextScene() {
        // update the index to be the next game
        const selectedGameSceneIndex = persistentData.roomData?.game.selectedGameSceneIndex;
        const gameName = persistentData.roomData?.game.selectedGameName;
        if (selectedGameSceneIndex === null || selectedGameSceneIndex === undefined) {
            throw new Error('selectedGameSceneIndex is null');
        }
        if (!gameName) {
            throw new Error('gameName is null');
        }
        const updateGame: Partial<Game> = {
            selectedGameSceneIndex: selectedGameSceneIndex + 1,
        };
        socket.emit('update room data', updateGame);
        const sceneToStart = getGameFromName(gameName).sceneOrder[selectedGameSceneIndex + 1];
        this.scene.start(sceneToStart)
    }

    // maybe this https://stackoverflow.com/a/68835401/2948122
    setUrlToHomeScreen() {
        // set the url to the home screen
        // change the url using react router
        const { CustomEvent } = window;
        const event = new CustomEvent('changeroute', { detail: `/room/${persistentData.roomData?.room}` });
        window.dispatchEvent(event);
    }
}
