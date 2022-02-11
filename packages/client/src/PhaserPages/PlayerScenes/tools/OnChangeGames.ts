import { RoomData } from "api";
import socket from "../../../SocketConnection";
import { persistentData } from "../../tools/objects/PersistantData";

export const onChangeGames = (scene: Phaser.Scenes.ScenePlugin) => {
    socket.off();
    socket.on("room data", (roomData: RoomData) => {
        console.log("GOT ROOM DATA");
        // console.log('set room persistent data');
        // start scene if scene is different
        (() => {
            if (!roomData.currentPlayerScene) {
                console.log('current player scene is null');
                return;
            }
            if (scene.key === roomData.currentPlayerScene) {
                console.log('current player scene is the same');
                console.log('roomData', roomData.currentPlayerScene, scene.key);
                return;
            }
            console.log('current player scene is different', roomData.currentPlayerScene, scene.key);
            scene.start(roomData.currentPlayerScene);
        })()
        persistentData.roomData = roomData;
    });
}