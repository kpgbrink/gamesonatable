import { RoomData } from "api";
import socket from "../../SocketConnection";
import { persistentData } from "./objects/PersistantData";

export const onChangeGames = (scene: Phaser.Scenes.ScenePlugin) => {
    socket.off();
    socket.on("room data", (roomData: RoomData) => {
        console.log('set room persistent data');
        persistentData.roomData = roomData;
    });
    socket.on("select game", (game: string) => {
        console.log("game selected", game);
        scene.start(game);
    });
}