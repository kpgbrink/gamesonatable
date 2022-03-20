import { RoomData } from "api";
import socket from "../../../SocketConnection";
import { persistentData } from "./PersistantData";
import UserAvatarContainer, { makeMyUserAvatar } from "./UserAvatarContainer";

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
    const screenCenter = getScreenCenter(scene);
    if (!persistentData.roomData) return;
    const text = `${findMyUser(persistentData.roomData)?.name}`;
    return scene.add.text(screenCenter.x, 16, `${text}`, { color: 'white', fontSize: '20px ' }).setOrigin(0.5);
}

export const socketOffOnSceneShutdown = (phaserScene: Phaser.Scene) => {
    phaserScene.events.once('shutdown', () => {
        console.log('scene shutdown');
        socket.off();
    });
};

export const getScreenDimensions = (scene: Phaser.Scene) => {
    return {
        width: scene.cameras.main.width,
        height: scene.cameras.main.height
    }
}

export const getScreenCenter = (scene: Phaser.Scene) => {
    return {
        x: scene.cameras.main.worldView.x + scene.cameras.main.width / 2,
        y: scene.cameras.main.worldView.x + scene.cameras.main.height / 2
    }
}


export const makeMyUserAvatarInCenterOfPlayerScreen = (playerScene: Phaser.Scene, userAvatarContainer: UserAvatarContainer | null) => {
    var screenCenter = getScreenCenter(playerScene);
    userAvatarContainer = null;
    userAvatarContainer = makeMyUserAvatar(playerScene, screenCenter.x, screenCenter.y, userAvatarContainer) || userAvatarContainer;
    socket.on('room data', (roomData) => {
        persistentData.roomData = roomData;
        if (userAvatarContainer) return;
        userAvatarContainer = makeMyUserAvatar(playerScene, screenCenter.x, screenCenter.y, userAvatarContainer) || userAvatarContainer;
    });
}

export const GetAngle = (vector: Phaser.Math.Vector2): number => {
    const angle = Math.atan2(vector.y, vector.x);
    return angle;
}

export const DegreesToRadians = (degrees: number): number => {
    return degrees * (Math.PI / 180);
}

export const RadiansToDegrees = (radians: number): number => {
    return radians * (180 / Math.PI);
}

