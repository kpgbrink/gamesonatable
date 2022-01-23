
export interface QueryPayLoad {
    foo: string;
}

export interface User {
    id: string;
    name: string;
    room: string;
    isHost: boolean;
}

export interface RoomData {
    room: string;
    users: User[];
}
