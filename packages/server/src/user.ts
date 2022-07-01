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
        rooms.set(user.room, {
            game: {
                currentPlayerScene: 'PlayerStartingScene',
                selectedGame: null,
                leavable: null,
                joinable: null,
            },
            room: user.room, users: []
        });
    }
    const roomData = rooms.get(user.room);
    if (roomData) {
        roomData.users = roomData.users.filter(u => u.id !== user.id);
        roomData.users.push(user);
    }
    return user;
}

export const updateUser = (userUpdate: Partial<User>, user: User) => {
    // only update if user is in room
    const roomData = rooms.get(user.room);
    if (!roomData) {
        console.log('does not have room');
        return;
    }
    const foundUser = roomData.users.find(u => u.id === user.id);
    if (!foundUser) {
        console.log('does not have user');
        return;
    }
    Object.assign(foundUser, userUpdate);
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
    // If the user is in game and the game is not leavable, keep the user in the game
    const user = room.users[index];
    if (room.game.leavable === false && user.inGame) {
        console.log('user is in game that is not leavable so keep them in game');
        // remove the socket id from the user
        room.users[index].socketId = null;
        console.log('keeping user in game');
        checkIfShouldDeleteRoom(room);
        return;
    }
    console.log('deleting user');
    // remove user from room map
    if (room) {
        room.users = room.users.filter((user) => {
            return user.socketId !== userSocketSocketId;
        });
    }
    checkIfShouldDeleteRoom(room);
}

// delete room if no users or all users have no socket id
const checkIfShouldDeleteRoom = (room: RoomData) => {
    // delete room if no users or all users have no socket id
    if (room && room.users.length === 0 || room.users.every((user) => { return user.socketId === null })) {
        rooms.delete(room.room);
        console.log('all existing rooms count ', rooms.size);
        console.log('all existing rooms', rooms);
    }
}

export const removeAllUsersWithoutSocketId = (roomId: string) => {
    // remove all users without socket id
    const room = getRoom(roomId);
    if (!room) return;
    room.users = room.users.filter((user) => {
        return user.socketId !== null;
    });
    checkIfShouldDeleteRoom(room);
}

// get room
export const getRoom = (roomId: string) => {
    const room = rooms.get(roomId);
    return room;
}

export const getRoomHost = (room: string) => {
    const roomData = getRoom(room);
    if (!roomData) return;
    return roomData.users.find(u => u.isHost);
}

export const getRoomHostSocketId = (room: string) => {
    return getRoomHost(room)?.socketId;
}