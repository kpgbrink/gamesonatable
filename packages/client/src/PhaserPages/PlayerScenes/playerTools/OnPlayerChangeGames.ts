import { RoomData } from "api";
import socket from "../../../SocketConnection";
import { persistentData } from "../../objects/PersistantData";

export const onPlayerChangeGames = (phaserScene: Phaser.Scene) => {
    socket.on("room data", (roomData: RoomData) => {
        // start scene if scene is different
        (() => {
            if (!roomData.currentPlayerScene) {
                return;
            }
            if (phaserScene.scene.key === roomData.currentPlayerScene) {
                return;
            }
            phaserScene.scene.start(roomData.currentPlayerScene);
        })()
        persistentData.roomData = roomData;
    });
}


