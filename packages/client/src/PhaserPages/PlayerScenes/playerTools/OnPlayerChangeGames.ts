import { RoomData } from "api";
import socket from "../../../SocketConnection";
import { persistentData } from "../../objects/PersistantData";

export const onPlayerChangeGames = (phaserScene: Phaser.Scene) => {
    socket.on("room data", (roomData: RoomData) => {
        // start scene if scene is different
        (() => {
            if (!roomData?.game.currentPlayerScene) {
                return;
            }
            if (phaserScene.scene.key === roomData.game.currentPlayerScene) {
                return;
            }
            phaserScene.scene.start(roomData.game.currentPlayerScene);
        })()
        persistentData.roomData = roomData;
    });
}


