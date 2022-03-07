import { RoomData } from "api";
import socket from "../../../SocketConnection";
import { persistentData } from "./PersistantData";

// Random index from array
export const randomIndex = (array: any[]) => {
    return Math.floor(Math.random() * array.length);
}

export const findMyUser = (roomData: RoomData | undefined) => {
    if (!roomData) return;
    return roomData.users.find(user => user?.id === socket.id);
}

export const loadIfNotLoadedAndImageExists = (scene: Phaser.Scene, name: string, url: string, arrayIndex: number) => {
    if (arrayIndex === -1) return;
    loadIfNotLoaded(scene, name, url);
}

export const loadIfNotLoaded = (scene: Phaser.Scene, name: string, url: string) => {
    if (!scene.textures.exists(name)) {
        scene.load.image(name, url);
    }
}

export const addUserNameText = (scene: Phaser.Scene) => {
    const screenX = scene.cameras.main.worldView.x + scene.cameras.main.width;
    if (!persistentData.roomData) return;
    const text = `${findMyUser(persistentData.roomData)?.name}`;
    return scene.add.text(screenX / 2, 10, `${text}`, { color: 'white', fontSize: '20px ' }).setOrigin(0.5);
}

export const socketOffOnSceneShutdown = (phaserScene: Phaser.Scene) => {
    phaserScene.events.once('shutdown', () => {
        console.log('scene shutdown');
        socket.off();
    });

    // phaserScene.events.once('destroy', () => {
    //     console.log('scene destroy');
    //     socket.off();
    // });
};