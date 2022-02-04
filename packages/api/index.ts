export interface NewRoomId {
    roomId: string;
};

export interface UserAvatar {
    // Index of image in avatar Images
    base: number; // The base image
    beard: number; // The beard image
    body: number; // The body image
    boots: number; // The boots image
    hair: number; // The hair image
    head: number; // The head image
    legs: number; // The legs image
}

export interface User {
    id: string;
    name: string;
    room: string;
    isHost: boolean;
    userColor: string | null;
    userAvatar: UserAvatar | null;
}

export interface RoomData {
    room: string;
    users: User[];
}
