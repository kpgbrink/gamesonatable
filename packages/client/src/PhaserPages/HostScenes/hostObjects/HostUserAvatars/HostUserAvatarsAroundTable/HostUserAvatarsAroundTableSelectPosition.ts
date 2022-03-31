import UserAvatarContainer from "../../../../objects/UserAvatarContainer";
import { HostUserAvatarsAroundTable } from "../HostUserAvatarsAroundTable";

export class HostUserAvatarsAroundTableSelectPosition extends HostUserAvatarsAroundTable {
    moveToEdgeOfTableSpeed: number = 5;

    override afterUserAvatarCreated(userAvatarContainer: UserAvatarContainer): void {
        super.afterUserAvatarCreated(userAvatarContainer);
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
        userAvatarContainer.onSizeChange = (userAvatarContainer: UserAvatarContainer) => {
            userAvatarContainer.setInteractive({ useHandCursor: true });
            this.scene.input.setDraggable(userAvatarContainer);
        };
    }

}