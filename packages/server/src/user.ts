import { RoomData, User } from 'api';
import { allRaces, nameByRace } from 'fantasy-name-generator';

const rooms: Map<string, RoomData> = new Map();

export const upsertUser = (upsertingUser: User) => {
    upsertingUser.name = upsertingUser.name.trim();
    if (upsertingUser.name === '' && !upsertingUser.isHost) {
        upsertingUser.name = (() => {
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

    const user: User = upsertingUser;
    // add room if it doesn't exist yet
    if (!rooms.has(user.room)) {
        rooms.set(user.room, { currentPlayerScene: 'PlayerStartingScene', selectedGame: null, room: user.room, users: [] });
    }
    const roomData = rooms.get(user.room);
    if (roomData) {
        roomData.users = roomData.users.filter(u => u.id !== user.id);
        roomData.users.push(user);
    }
    return user;
}

export const removeUser = (userSocketSocketId: string, roomId: string) => {
    const room = getRoom(roomId);
    if (!room) return;
    const index = room.users.findIndex((user) => {
        return user.socketId === userSocketSocketId
    });
    if (index == -1) {
        return;
    }
    // remove user from room map
    if (room) {
        room.users = room.users.filter((user) => {
            return user.socketId !== userSocketSocketId;
        });
    }
    // delete room if no users
    if (room && room.users.length === 0) {
        rooms.delete(roomId);
    }
}

// get room
export const getRoom = (roomId: string) => {
    const room = rooms.get(roomId);
    return room;
}

export const getRoomHost = (room: string) => {
    console.log('getRoomHost', room);
    const roomData = getRoom(room);
    console.log('getRoomHost', roomData);
    if (!roomData) return;
    return roomData.users.find(u => u.isHost);
}

export const getRoomHostSocketId = (room: string) => {
    console.log('getRoomHostId');
    return getRoomHost(room)?.socketId;
}