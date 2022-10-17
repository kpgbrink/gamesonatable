import { Game } from "api";
import { getGameFromName } from "api/src/gamesList";
import Phaser from "phaser";
import socket from "../../../SocketConnection";
import { persistentData } from "../../objects/PersistantData";
import { socketOffOnSceneShutdown } from "../../objects/Tools";
import { loadUserAvatarSprites } from "../../objects/UserAvatarContainer";
import { onHostChangeGames } from "../hostTools/OnHostChangeGames";


export default abstract class HostScene extends Phaser.Scene {
    abstract playerSceneKey: string;

    create() {
        socket.off();
        // change the game playerSceneKey
        socket.emit('update game', { currentPlayerScene: this.playerSceneKey });
        onHostChangeGames(this);
        socketOffOnSceneShutdown(this);
        loadUserAvatarSprites(this);
        this.scale.refresh();
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
}
