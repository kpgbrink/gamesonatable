import { RoomData } from "api";
import socket from "../../../SocketConnection";
import PlayerScene from "../../PlayerScenes/tools/PlayerScene";
import { persistentData } from "./PersistantData";
import { makeMyUserAvatar } from "./UserAvatarContainer";

// Random index from array
export const randomIndex = (array: any[]) => {
    return Math.floor(Math.random() * array.length);
}

export const findMyUser = (roomData: RoomData | undefined) => {
    if (!roomData) return;
    return roomData.users.find(user => user?.id === socket.id);
}

export const loadIfImageNotLoadedAndUserAvatarHasIt = (scene: Phaser.Scene, name: string, url: string, arrayIndex: number) => {
    if (arrayIndex === -1) return;
    loadIfImageNotLoaded(scene, name, url);
}

export const loadIfImageNotLoaded = (scene: Phaser.Scene, name: string, url: string) => {
    if (!scene.textures.exists(name)) {
        scene.load.image(name, url);
    }
}

export const loadIfSpriteSheetNotLoaded = (scene: Phaser.Scene, name: string, url: string, frameConfig?: Phaser.Types.Loader.FileTypes.ImageFrameConfig) => {
    scene.load.spritesheet(name, url, frameConfig);
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
        width: scene.cameras.main?.width || 0,
        height: scene.cameras.main?.height || 0
    }
}

export const getScreenCenter = (scene: Phaser.Scene) => {
    return {
        x: scene.cameras.main.worldView.x + scene.cameras.main.width / 2,
        y: scene.cameras.main.worldView.x + scene.cameras.main.height / 2
    }
}

export const makeMyUserAvatarInCenterOfPlayerScreen = (playerScene: PlayerScene) => {
    var screenCenter = getScreenCenter(playerScene);
    playerScene.userAvatarContainer = null;
    playerScene.userAvatarContainer = makeMyUserAvatar(playerScene, screenCenter.x, screenCenter.y, playerScene.userAvatarContainer) || playerScene.userAvatarContainer;
    socket.on('room data', (roomData) => {
        persistentData.roomData = roomData;
        if (playerScene.userAvatarContainer) return;
        playerScene.userAvatarContainer = makeMyUserAvatar(playerScene, screenCenter.x, screenCenter.y, playerScene.userAvatarContainer) || playerScene.userAvatarContainer;
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

export const addFullScreenButton = (scene: Phaser.Scene) => {
    const screenDimensions = getScreenDimensions(scene);
    var button = scene.add.image(screenDimensions.width - 16, 16, 'fullscreen-white', 0).setOrigin(1, 0).setInteractive();

    if (scene.scale.isFullscreen) {
        button.setVisible(false);
    }
    // on full screen exit show button again
    scene.scale.on(Phaser.Scale.Events.ENTER_FULLSCREEN, () => {
        button.setVisible(false);
    });

    scene.scale.on(Phaser.Scale.Events.LEAVE_FULLSCREEN, () => {
        button.setVisible(true);
    });

    button.on('pointerup', function () {
        scene.scale.startFullscreen();
    }, this);
}

// Get all users that are not host
export const playersInRoomm = (roomData: RoomData | null) => {
    if (!roomData) return [];
    return roomData.users.filter(user => user.isHost === false);
}

// Get all users that are in the game
export const playersInGame = (roomData: RoomData | null) => {
    if (!roomData) return [];
    return roomData.users.filter(user => user.isInGame === true);
}

// Quadratic formula
export const quadraticFormula = (a: number, b: number, c: number) => {
    const d = Math.sqrt(b * b - 4 * a * c);
    const x1 = (-b + d) / (2 * a);
    const x2 = (-b - d) / (2 * a);
    return [x1, x2];
}

// distance between 2 points
export const distanceBetweenTwoPoints = (x1: number, y1: number, x2: number, y2: number) => {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

export const pow2 = (x: number) => {
    return x * x;
}

// https://stackoverflow.com/questions/491738/how-do-you-calculate-the-average-of-a-set-of-circular-data
export const getAverageRadians = (array: number[]) => {
    let arrayLength = array.length;

    let sinTotal = 0;
    let cosTotal = 0;

    for (let i = 0; i < arrayLength; i++) {
        sinTotal += Math.sin(array[i]);
        cosTotal += Math.cos(array[i]);
    }

    let averageDirection = Math.atan(sinTotal / cosTotal);

    if (cosTotal < 0) {
        averageDirection += DegreesToRadians(180);
    } else if (sinTotal < 0) {
        averageDirection += DegreesToRadians(360);
    }

    return averageDirection;
}

