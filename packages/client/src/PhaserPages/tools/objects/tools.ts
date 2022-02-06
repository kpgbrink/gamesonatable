import { RoomData } from "api";
import socket from "../../../SocketConnection";

// Random index from array
export const randomIndex = (array: any[]) => {
    return Math.floor(Math.random() * array.length);
}

export const findMyUser = (roomData: RoomData) => {
    return roomData.users.find(user => user?.id === socket.id);
}