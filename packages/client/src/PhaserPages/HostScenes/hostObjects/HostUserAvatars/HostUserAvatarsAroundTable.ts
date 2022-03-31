import { getScreenCenter } from "../../../objects/Tools";
import UserAvatarContainer from "../../../objects/UserAvatarContainer";
import { calculateDistanceAndRotationFromTable } from "../../tools/HostTools";
import { HostUserAvatars } from "../HostUserAvatars";



export class HostUserAvatarsAroundTable extends HostUserAvatars {
    moveToEdgeOfTableSpeed: number = 8;

    setUserAvatarsMoveable() {

    }

    moveToEdgeOfTable() {
        const screenCenter = getScreenCenter(this.scene);
        // Move all users to their correct position
        this.userAvatarContainers.forEach((userAvatar) => {
            // calculate distance from center
            const distanceFromCenter = Math.sqrt(Math.pow(userAvatar.x - screenCenter.x, 2) + Math.pow(userAvatar.y - screenCenter.y, 2));

            // calculate angle from center to user avatar
            const angleFromCenterToUserAvatar = Math.atan2(userAvatar.y - screenCenter.y, userAvatar.x - screenCenter.x);

            // Calculate max distance
            const { maxDistance, positionAngle } = calculateDistanceAndRotationFromTable(this.scene, { x: userAvatar.x, y: userAvatar.y });
            // increase distance from center to make it to the outside of circle
            const distanceFromCenterToOutside = Math.min(distanceFromCenter + this.moveToEdgeOfTableSpeed, maxDistance);
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


    override afterUserAvatarCreated(userAvatarContainer: UserAvatarContainer): void {
        super.afterUserAvatarCreated(userAvatarContainer);
        const user = userAvatarContainer.user;
        const screenCenter = getScreenCenter(this.scene);
        // if the rotation is already set move avatar to corrrect position
        if (user.rotation) {
            userAvatarContainer.x = screenCenter.x + (2000 * Math.cos(user.rotation));
            userAvatarContainer.y = screenCenter.y + (2000 * Math.sin(user.rotation));
        }

    }
}