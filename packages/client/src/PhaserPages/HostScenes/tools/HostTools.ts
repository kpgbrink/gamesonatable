import { RoomData } from "api";
import { getScreenCenter } from "../../tools/objects/Tools";
import UserAvatarContainer from "../../tools/objects/UserAvatarContainer";


export const createTable = (scene: Phaser.Scene) => {
    // Make the table
    const screenCenter = getScreenCenter(scene);
    scene.add.image(screenCenter.x, screenCenter.y, 'table');
}

export interface UserAvatarScene extends Phaser.Scene {
    userAvatars: UserAvatarContainer[];
}

export const addUserAvatars = (scene: UserAvatarScene, roomData: RoomData, onSizeChange?: (userAvatarContainer: UserAvatarContainer) => void) => {
    // Create a user avatar for each user
    roomData?.users.forEach((user) => {
        if (!user.userAvatar) return;
        if (user.isHost) return;
        // Don't recreate a user avatar if it already exists
        if (scene.userAvatars.find((userAvatar) => userAvatar.user.id === user.id)) return;
        const screenCenter = getScreenCenter(scene);
        const userAvatarContainer = new UserAvatarContainer(scene, screenCenter.x + Math.random() - .5, screenCenter.y + Math.random() - .5, user, onSizeChange);
        // if the rotation is already set then set the location to the correct rotation
        if (user.rotation) {
            // userAvatarContainer.tableRotation = user.rotation;
            console.log('set rotation!!!!', user.rotation);
            userAvatarContainer.x = screenCenter.x + (2000 * Math.cos(user.rotation));
            userAvatarContainer.y = screenCenter.y + (2000 * Math.sin(user.rotation));
        }

        scene.add.existing(userAvatarContainer);
        scene.userAvatars.push(userAvatarContainer);
        userAvatarContainer.on('pointerover', () => {
            userAvatarContainer?.bodyImage?.setTint(0x44ff44);
            userAvatarContainer?.baseImage?.setTint(0x44ff44);
            userAvatarContainer?.legsImage?.setTint(0x44ff44);
        });
        userAvatarContainer.on('pointerout', () => {
            userAvatarContainer?.bodyImage?.clearTint();
            userAvatarContainer?.baseImage?.clearTint();
            userAvatarContainer?.legsImage?.clearTint();
        });
    });
    // Remove any user avatars that are no longer in the room
    scene.userAvatars.forEach((userAvatar) => {
        if (roomData?.users.find((user) => user.id === userAvatar.user.id)) return;
        userAvatar.destroy();
        scene.userAvatars.splice(scene.userAvatars.indexOf(userAvatar), 1);
    });
}


