import { RoomData } from "@kbrink/api";
import socket from "../../../SocketConnection";
import { persistentData } from "../../objects/PersistantData";

export const onHostChangeGames = (phaserScene: Phaser.Scene) => {
    socket.on("room data", (roomData: RoomData) => {
        // start scene if scene is different
        persistentData.roomData = roomData;
    });
}
