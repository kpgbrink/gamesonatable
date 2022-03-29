import { RoomData } from "api";
import { distanceBetweenTwoPoints, getAverageRadians, getScreenCenter, Position, pow2, quadraticFormula } from "../../tools/objects/Tools";
import UserAvatarContainer from "../../tools/objects/UserAvatarContainer";
import HostScene from "./HostScene";


export const createTable = (scene: Phaser.Scene) => {
    // Make the table
    const screenCenter = getScreenCenter(scene);
    scene.add.image(screenCenter.x, screenCenter.y, 'table');
}

export interface UserAvatarScene extends HostScene {
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

export const calculateDistanceAndRotationFromTable = (scene: HostScene, position: Position) => {
    const screenCenter = getScreenCenter(scene);
    // calculate angle from center to user avatar
    const angleFromCenterToposition = Math.atan2(position.y - screenCenter.y, position.x - screenCenter.x);

    const tableHalfHeight = scene.table.height / 2;
    const tableHalfWidth = scene.table.width / 2;
    const tableHalfOvalWidth = scene.table.ovalWidth / 2;
    // Calculate max distance
    const distanceSideWall = Math.abs(tableHalfWidth / Math.cos(angleFromCenterToposition));
    const distanceTopWall = Math.abs(tableHalfHeight / Math.sin(angleFromCenterToposition));
    if (distanceTopWall < distanceSideWall) {
        // Check if the user avatar is in the top or bottom half of the table
        // User avatar is in the top half of the table
        const facingStraightDownDirection = (() => {
            if (position.y > screenCenter.y) {
                return Math.PI / 2;
            }
            return -Math.PI / 2;
        })();

        return {
            maxDistance: distanceTopWall,
            positionAngle: getAverageRadians([angleFromCenterToposition, facingStraightDownDirection, facingStraightDownDirection]) - Math.PI / 2
        };
    }
    // calculate height from hypotenuse and adjacent
    const heightOpposite = Math.sqrt(Math.abs(Math.pow(distanceSideWall, 2) - Math.pow(tableHalfWidth, 2)));

    // add distance of the circle at the height
    const a = pow2(Math.tan(angleFromCenterToposition)) + ((1 / 4) * pow2(scene.table.height)) / pow2(tableHalfOvalWidth);
    const b = 2 * heightOpposite * Math.tan(angleFromCenterToposition);
    const c = pow2(heightOpposite) - 1 / 4 * pow2(scene.table.height);
    const xLocations = quadraticFormula(a, b, c);
    const equation = (x: number) => {
        return Math.tan(angleFromCenterToposition) * x + heightOpposite;
    }
    const getDistance = (x: number) => {
        const y = equation(x);
        const distance = distanceBetweenTwoPoints(x, y, 0, heightOpposite);
        return distance;
    };
    let lowestDistance = Infinity;
    let lowestX = 0;
    xLocations.forEach((x) => {
        const distance = getDistance(x);
        if (distance < lowestDistance) {
            lowestDistance = distance;
            lowestX = x;
        }
    });
    const lowestY = equation(lowestX);
    // angle to lowest point
    const angleToLowestPoint = (() => {
        const angle = Math.atan2(lowestY, lowestX);
        if (angleFromCenterToposition < 0) {
            return angle + Math.PI;
        }
        return angle;
    })();
    // Fix angle being backwards
    return { maxDistance: distanceSideWall + lowestDistance, positionAngle: getAverageRadians([angleToLowestPoint, angleToLowestPoint, angleFromCenterToposition]) - Math.PI / 2 };
}

export const moveUserAvatarToProperTableLocation = (scene: UserAvatarScene) => {
    const screenCenter = getScreenCenter(scene);
    // Move all users to their correct position
    scene.userAvatars.forEach((userAvatar) => {
        // calculate distance from center
        const distanceFromCenter = Math.sqrt(Math.pow(userAvatar.x - screenCenter.x, 2) + Math.pow(userAvatar.y - screenCenter.y, 2));

        // calculate angle from center to user avatar
        const angleFromCenterToUserAvatar = Math.atan2(userAvatar.y - screenCenter.y, userAvatar.x - screenCenter.x);

        // Calculate max distance
        const { maxDistance, positionAngle } = calculateDistanceAndRotationFromTable(scene, { x: userAvatar.x, y: userAvatar.y });
        // increase distance from center to make it to the outside of circle
        const distanceFromCenterToOutside = Math.min(distanceFromCenter + 8, maxDistance);
        // calculate new x and y position
        const newX = screenCenter.x + distanceFromCenterToOutside * Math.cos(angleFromCenterToUserAvatar);
        const newY = screenCenter.y + distanceFromCenterToOutside * Math.sin(angleFromCenterToUserAvatar);
        // move user avatar to new position
        userAvatar.x = newX;
        userAvatar.y = newY;
        userAvatar.tableRotation = angleFromCenterToUserAvatar;
        // rotate user avatar to face the center
        userAvatar.rotation = positionAngle;
    });
}


