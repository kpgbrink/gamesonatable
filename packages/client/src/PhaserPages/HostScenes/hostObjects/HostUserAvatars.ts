import { RoomData, User } from "api";
import { persistentData } from "../../objects/PersistantData";
import { getScreenCenter } from "../../objects/Tools";
import UserAvatarContainer from "../../objects/UserAvatarContainer";

export class HostUserAvatars {
    scene: Phaser.Scene;
    userAvatarContainers: UserAvatarContainer[] = [];
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

    createUserAvatarContainer(x: number, y: number, user: User) {
        const userAvatarContainer = new UserAvatarContainer(this.scene, x, y, user);
        return userAvatarContainer;
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
            // const userAvatarContainer = new UserAvatarContainer(this.scene, screenCenter.x + Math.random() - .5, screenCenter.y + Math.random() - .5, user);
            const userAvatarContainer = this.createUserAvatarContainer(screenCenter.x + Math.random() - .5, screenCenter.y + Math.random() - .5, user);
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
        // order users by rotation
        const users = this.userAvatarContainers.sort((a, b) => a.rotation - b.rotation);
        // find the next user from the current dealer`
        const currentUserIndex = users.findIndex(u => u.user.id === userId);
        if (currentUserIndex === -1) {
            console.error(`User ${userId} not found in userAvatarContainers`);
            throw new Error(`User ${userId} not found in userAvatarContainers`);
        }
        const nextUserIndex = (currentUserIndex + 1) % users.length;
        return users[nextUserIndex].user.id;
    }

    update(time: number, delta: number) {
        this.userAvatarContainers.forEach((userAvatar) => {
            userAvatar.update(time, delta);
        });
    }
}