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
    socketId: string | null;
    name: string;
    room: string;
    isHost: boolean;
    userColor: string | null;
    userAvatar: UserAvatar | null;
    rotation: number | null;
    inGame: boolean;
    hasSetName: boolean;
}

export interface GameData {
    // If someone is able to leave a game in the middle of a game
    leavable: boolean | null;
    // If game is joinable when the game is running
    joinable: boolean | null;
}

export interface Game extends GameData {
    currentPlayerScene: string | null;
    selectedGame: string | null;
}

export interface RoomData {
    room: string;
    users: User[];
    game: Game;
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