import { RoomData } from "api";

// create class that stores persistent data between scenes
export class PersistantData {
    constructor() {
        this.roomData = null;
    }

    public roomData: RoomData | null;
}

export const persistentData: PersistantData = new PersistantData();