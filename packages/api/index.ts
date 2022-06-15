export interface NewRoomId {
    roomId: string;
};

export interface NewUserId {
    userId: string;
}

export interface UserAvatar {
    // Index of image in avatar Images
    base: number; // The base image
    beard: number; // The beard image
    body: number; // The body image
    cloak: number; // The cloak image
    gloves: number; // The gloves image
    boots: number; // The boots image
    hair: number; // The hair image
    head: number; // The head image
    legs: number; // The legs image
}

export interface User {
    id: string;
    socketId: string;
    name: string;
    room: string;
    isHost: boolean;
    userColor: string | null;
    userAvatar: UserAvatar | null;
    rotation: number | null;
    inGame: boolean;
    hasSetName: boolean;
}

export interface RoomData {
    currentPlayerScene: string | null; // The current Phaser scene
    selectedGame: string | null; // The current game we are trying to play
    room: string;
    users: User[];
}

export interface UserBeforeGameStartData {
    ready: boolean;
}

export interface UserBeforeGameStartDataDictionary {
    [userId: string]: UserBeforeGameStartData;
}

export interface CardContent {
    suit: string | null;
    card: string | null;
    joker: boolean | null;
}