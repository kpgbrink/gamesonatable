import { User } from "api";
import { DegreesToRadians } from "../../../../objects/Tools";
import UserAvatarContainer from "../../../../objects/UserAvatarContainer";
import { HostUserAvatarsAroundTable } from "../HostUserAvatarsAroundTable";

export class HostUserAvatarsAroundTableGame<UserAvatarContainerType extends UserAvatarContainer> extends HostUserAvatarsAroundTable {
    userAvatarContainers: UserAvatarContainerType[] = [];
    moveToEdgeOfTableSpeed: number = 10;

    override moveToEdgeOfTable() {
        super.moveToEdgeOfTable();
        this.userAvatarContainers.forEach((userAvatarContainer: UserAvatarContainerType) => {
            userAvatarContainer.rotation += DegreesToRadians(180);
        });
    }

    override afterUserAvatarCreated(userAvatarContainer: UserAvatarContainerType): void {
        super.afterUserAvatarCreated(userAvatarContainer);
    }

    createUserAvatarContainer(x: number, y: number, user: User) {
        const userAvatarContainer = new UserAvatarContainer(this.scene, x, y, user);
        return userAvatarContainer;
    }

    update(time: number, delta: number) {
        super.update(time, delta);
    }

    getUserAvatarContainer(userId: string): UserAvatarContainerType | null {
        return this.userAvatarContainers.find((userAvatarContainer: UserAvatarContainerType) => userAvatarContainer.user.id === userId) || null;
    }

}