import { RoomData } from "api";
import { getGameFromName } from "api/src/gamesList";
import socket from "../../SocketConnection";
import HostScene from "./hostObjects/HostScene";

// Just the starting scene before transitioning to the game scene
export default class HostBeginScene extends HostScene {
    playerSceneKey: string = "PlayerStartingScene";

    constructor() {
        super({ key: 'HostBeginScene' });
    }

    create() {
        super.create();
        // immediatly move to the selected game starting scene
        // on room data update
        socket.on('room data', (roomData: RoomData) => {
            if (!roomData.game.selectedGameName) return;
            const game = getGameFromName(roomData.game.selectedGameName);
            if (game) {
                this.scene.start(game.sceneOrder[0]);
            }
        });

        socket.emit('get room data');
    }

    startGame() {
        // get the sceneOrder from the game

    }
}
