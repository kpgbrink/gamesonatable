import { RoomData } from "api";
import socket from "../../../SocketConnection";
import { persistentData } from "../../objects/PersistantData";

export const onPlayerChangeGames = (phaserScene: Phaser.Scene) => {
    socket.on("room data", (roomData: RoomData) => {
        // If room is undefined or no Host user then refresh the page
        if (!roomData || !roomData.users.find(user => user.isHost)) {
            window.location.reload();
        }
        // start scene if scene is different
        (() => {
            if (!roomData?.game.currentPlayerScene) {
                return;
            }
            if (phaserScene.scene.key === roomData.game.currentPlayerScene) {
                return;
            }

            window.dispatchEvent(new CustomEvent('showGamesListMenu', { detail: { show: false } }));
            phaserScene.scene.start(roomData.game.currentPlayerScene);
        })()
        persistentData.roomData = roomData;
    });
}


