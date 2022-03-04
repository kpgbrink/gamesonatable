import { RoomData } from "api";
import socket from "../../../SocketConnection";
import { persistentData } from "../../tools/objects/PersistantData";

export const onHostChangeGames = (phaserScene: Phaser.Scene) => {
    socket.on("room data", (roomData: RoomData) => {
        // console.log('set room persistent data');
        // start scene if scene is different
        persistentData.roomData = roomData;
    });
}
