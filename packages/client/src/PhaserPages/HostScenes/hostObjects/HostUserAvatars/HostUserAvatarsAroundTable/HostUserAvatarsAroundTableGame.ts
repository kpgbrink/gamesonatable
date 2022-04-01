import { DegreesToRadians } from "../../../../objects/Tools";
import UserAvatarContainer from "../../../../objects/UserAvatarContainer";
import { HostUserAvatarsAroundTable } from "../HostUserAvatarsAroundTable";

export class HostUserAvatarsAroundTableGame extends HostUserAvatarsAroundTable {
    moveToEdgeOfTableSpeed: number = 10;

    override moveToEdgeOfTable() {
        super.moveToEdgeOfTable();
        this.userAvatarContainers.forEach((userAvatarContainer: UserAvatarContainer) => {
            userAvatarContainer.rotation += DegreesToRadians(180);
        });
    }

    override afterUserAvatarCreated(userAvatarContainer: UserAvatarContainer): void {
        super.afterUserAvatarCreated(userAvatarContainer);
    }
}