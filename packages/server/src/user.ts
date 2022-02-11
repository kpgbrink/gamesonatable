import { RoomData, User } from 'api';
import { allRaces, nameByRace } from 'fantasy-name-generator';

const rooms: Map<string, RoomData> = new Map();

export const upsertUser = ({ id, name, room, isHost }: User) => {
    name = name.trim();
    if (name === '') {
        name = (() => {
            const allRacesList = [...allRaces.racesWithGender, ...allRaces.otherRaces];
            const gender: "male" | "female" = (() => {
                const randomNumber = Math.random();
                if (randomNumber <= .5) {
                    return "male";
                }
                return "female";
            })();
            const newName = nameByRace(allRacesList[Math.floor(Math.random() * allRacesList.length)], { gender: gender, allowMultipleNames: false });
            if (typeof newName !== 'string') throw newName;
            return newName
        })();
    };
    room = room;

    const user: User = { id, name, room, isHost, userColor: null, userAvatar: null };
    // add room if it doesn't exist yet
    if (!rooms.has(user.room)) {
        rooms.set(user.room, { currentPlayerScene: 'PlayerStartingScene', selectedGame: null, userId: user.id, room: user.room, users: [] });
    }
    const roomData = rooms.get(user.room);
    if (roomData) {
        roomData.users = roomData.users.filter(u => u.id !== user.id);
        roomData.users.push(user);
    }
    return user;
}

export const removeUser = (userId: string, roomId: string) => {
    const room = getRoom(roomId);
    if (!room) return;
    const index = room.users.findIndex((user) => {
        return user.id === userId
    });
    if (index == -1) {
        return;
    }
    // remove user from room map
    if (room) {
        room.users = room.users.filter((user) => {
            return user.id !== userId;
        });
    }
    // delete room if no users
    if (room && room.users.length === 0) {
        rooms.delete(roomId);
    }
}

// get room
export const getRoom = (room: string) => rooms.get(room);
