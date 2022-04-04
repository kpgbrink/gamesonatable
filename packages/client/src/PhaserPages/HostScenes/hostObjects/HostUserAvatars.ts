import { RoomData } from "api";
import { persistentData } from "../../objects/PersistantData";
import { getScreenCenter } from "../../objects/Tools";
import UserAvatarContainer from "../../objects/UserAvatarContainer";

export class HostUserAvatars {
    userAvatarContainers: UserAvatarContainer[] = [];
    scene: Phaser.Scene;
    onlyThoseInGame = false;
    onSizeChange: (userAvatarContainer: UserAvatarContainer) => void = () => { };

    constructor(
        scene: Phaser.Scene,
    ) {
        this.scene = scene;
    }

    createOnRoomData() {
        this.createUsers(persistentData.roomData);
        this.scene.events.on('room data', (roomData: RoomData) => {
            this.createUsers(roomData);
        });
    }

    createUsers(roomData: RoomData | null) {
        if (roomData === null) return;
        // Create a user avatar for each user
        roomData?.users.forEach((user) => {
            if (!user.userAvatar) return;
            if (user.isHost) return;
            if (this.onlyThoseInGame && !user.inGame) return;
            // Don't recreate a user avatar if it already exists
            if (this.userAvatarContainers.find((userAvatar) => userAvatar.user.id === user.id)) return;
            const screenCenter = getScreenCenter(this.scene);
            const userAvatarContainer = new UserAvatarContainer(this.scene, screenCenter.x + Math.random() - .5, screenCenter.y + Math.random() - .5, user);
            this.afterUserAvatarCreated(userAvatarContainer);
            this.scene.add.existing(userAvatarContainer);
            this.userAvatarContainers.push(userAvatarContainer);
        });
        // Remove any user avatars that are no longer in the room
        this.userAvatarContainers.forEach((userAvatar) => {
            if (roomData?.users.find((user) => user.id === userAvatar.user.id)) return;
            userAvatar.destroy();
            this.userAvatarContainers.splice(this.userAvatarContainers.indexOf(userAvatar), 1);
        });
    }

    afterUserAvatarCreated(userAvatarContainer: UserAvatarContainer): void {

    }

    setDepth(depth: number) {
        this.userAvatarContainers.forEach((userAvatar) => {
            userAvatar.setDepth(depth);
        });
    }

    getUserById(userId: string) {
        return this.userAvatarContainers.find((userAvatar) => userAvatar.user.id === userId);
    }

    getRandomUserId() {
        return this.userAvatarContainers[Math.floor(Math.random() * this.userAvatarContainers.length)].user.id;
    }

    getNextUserIdFromRotation(userId: string) {
        const currentDealerUserId = this.userAvatarContainers.find(u => u.user.id === userId)?.user.id;
        // order users by rotation
        const users = this.userAvatarContainers.sort((a, b) => a.rotation - b.rotation);
        // fint the next user from the current dealer
        const currentDealerIndex = users.findIndex(u => u.user.id === currentDealerUserId) || -1;
        const nextDealerIndex = (currentDealerIndex + 1) % users.length;
        return users[nextDealerIndex].user.id;
    }
}