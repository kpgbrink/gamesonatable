import { RoomData } from "api";

// create class that stores persistent data between scenes
export class PersistantData {
    public roomData: RoomData | undefined;
}

export const persistentData: PersistantData = new PersistantData();