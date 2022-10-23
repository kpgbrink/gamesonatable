import { Game, NewRoomId, StoredBrowserIds, User, UserAvatar } from 'api';
import { GameData, PlayerData } from "api/src/data/Data";
import config from 'config';
import cors from 'cors';
import express from 'express';
import { Server, Socket } from "socket.io";
import uniqid from 'uniqid';
import { addUserToRoom, getRoom, getRoomHostSocketId, removeUser, updateUser } from './user';

const app = express();
const port = 3001;

const httpServer = app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
const io = new Server(httpServer, {
    cors: config.get('cors.origin'),
    pingInterval: 5000,
});

app.use(cors({ origin: config.get('cors.origin'), credentials: config.get('cors.credentials') }));

app.get('/getNewRoomId', (req, res) => {
    console.log('getNewRoomId----------------');
    const newRoomId: NewRoomId = { roomId: uniqid() + randomPin() };
    res.send(newRoomId);
});

// Generate random 6 digit number
const randomPin = () => {
    return Math.floor(Math.random() * 900000) + 100000;
};

const socketLeavePreviousRoom = (socket: Socket, user: User | undefined) => {
    if (!user) return;
    socket.leave(user.room);
}

io.on('connection', (socket) => {
    let user: User = {
        id: uniqid(),
        socketId: socket.id,
        name: '',
        room: '',
        isHost: false,
        userColor: null,
        userAvatar: null,
        rotation: null,
        inGame: false,
        hasSetName: false,
    };

    // Handle error event
    socket.on('window error', (error) => {
        console.log('-------------------------------------------------------------------------');
        console.log('Error', error);
    });

    // The current room I am in
    socket.on('host room', (room: string) => {
        console.log('start hosting room', room);
        socketLeavePreviousRoom(socket, user);
        // ensure there is only one host
        const previousHost = getRoomHostSocketId(room);
        // check if previous host is same as current host
        if (previousHost) {
            console.log('remove previous host');
            removeUser(previousHost, room);
        }
        user.isHost = true;
        user.room = room;
        user = addUserToRoom(user);
        socket.join(user.room);
    });

    socket.on('join room', (room: string, userId: string | undefined, storedIds: StoredBrowserIds) => {
        if (room === null) return;
        console.log('---------------');
        const storedUserId = storedIds.sessionStorage.userId ?? storedIds.localStorage.userId;
        const storedSocketId = storedIds.sessionStorage.socketId ?? storedIds.localStorage.socketId;
        socketLeavePreviousRoom(socket, user);
        user.isHost = false;
        user.room = room;
        user.socketId = socket.id;
        // make the socket join the room
        socket.join(user.room);
        // find any users that need to be replaced
        const roomData = getRoom(room);
        // console.log('roomData', roomData);
        if (!roomData) {
            console.log('emit room does not exist');
            socket.emit(
                'room issue',
                'Room does not exist',
                'The room you are trying to join does not exist. Maybe try again with a different link from the host.'
            );
            return;
        }
        // If there is no Host user in the room, then send the user that there is no host
        if (!roomData.users.find(u => u.isHost)) {
            console.log('emit no host');
            socket.emit('room issue', 'No Host', 'The room you are trying to join does not have a host.');
            return;
        }
        const users = roomData.users;

        // if I already match with a user socketId then I just send that user id
        const userSocketMatch = users.find(u => u.socketId === socket.id);
        if (userSocketMatch) {
            console.log('users in room', users);
            console.log('matched user', userSocketMatch);
            console.log('user socket match', userSocketMatch.id, userSocketMatch.socketId);
            socket.emit('user id', userSocketMatch.id);
            io.to(user.room).emit('room data', getRoom(user.room));
            return;
        }

        // Handle taking over a user that lost connection
        const usersWithoutSocketIds = users.filter(u => u.socketId === null);
        const userWithoutSocketIdMatchingUserId = usersWithoutSocketIds.find(u => u.id === userId)
        if (usersWithoutSocketIds.length > 0) {
            // if only one user is missing a socket id, then replace that user
            if (usersWithoutSocketIds.length === 1) {
                const userToReplace = usersWithoutSocketIds[0];
                userToReplace.socketId = socket.id;
                user = addUserToRoom(userToReplace);
                console.log('replace user only 1 user to replace', userToReplace.id);
                console.log('user.id', user.id);
                io.to(userToReplace.socketId).emit('user id', user.id);
                io.to(user.room).emit('room data', getRoom(user.room));
                return;
            }
            if (userWithoutSocketIdMatchingUserId) {
                // if the user id matches a user that is missing a socket id, then replace that user
                const userToReplace = userWithoutSocketIdMatchingUserId;
                userToReplace.socketId = socket.id;
                user = addUserToRoom(userToReplace);
                console.log('replace user user id matches user to replace', userToReplace.id, user.id);
                io.to(userToReplace.socketId).emit('user id', user.id);
                io.to(user.room).emit('room data', getRoom(user.room));
                return;
            }
            // if more than one user is missing a socket id 
            // and no matching to the user id, then send a list of users to replace
            else {
                console.log('replace user more than 1 user to replace');
                const usersToReplace = usersWithoutSocketIds.map(u => u.id);
                socket.emit('users to replace', usersToReplace);
                return;
            }
        }
        // TODO add way to instantly replace a user that still exists


        // Handle giving a user a new id if they connect but someone is already using the id
        // if given an id but a user already exists with that id, then give that person a new id. Someone might have
        // sent the link of their id to someone else
        // maybe just not handle this.. this is too hard...
        // Yeah I think I'm just going to have users override other users' ids this is hard...
        // maybe switch to local storage... to keep this simple. so if the user has this id in their local storage then they can over take it.
        // other wise it's probably a different device.
        const userWithSameUserId = users.find(u => u.id === userId && u.socketId !== socket.id);
        // If the stored user id is the same as the user id, then override the user id
        const sessionIdIsSame = storedIds.sessionStorage.userId === userId
        console.log('sesions id is same', sessionIdIsSame);
        if (userWithSameUserId && !sessionIdIsSame) {
            console.log('a user already has that id so make a new uniqid');
            user.socketId = socket.id;
            user = addUserToRoom(user);
            if (!user.socketId) return;
            io.to(user.socketId).emit('user id', user.id);
            io.to(user.room).emit('room data', getRoom(user.room));
            return;
        }
        // If not given a user id then just send the user their id
        if (!userId) {
            console.log('no user id given so send them their id');
            user.socketId = socket.id;
            user = addUserToRoom(user);
            if (!user.socketId) return;
            console.log('the user id', user.id);
            io.to(user.socketId).emit('user id', user.id);
            io.to(user.room).emit('room data', getRoom(user.room));
            return;
        }
        if (userId) {
            console.log('user id given so send them their id');
            // If given a user id then send the user their id if it matches the session storage unless if they have replaced a different user
            // otherwise make a new id...
            if (storedIds.sessionStorage.userId === userId) {
                user.id = userId;
                console.log('just give them back the id in url');
            }
            user.socketId = socket.id;
            user = addUserToRoom(user);
            if (!user.socketId) return;
            console.log('the user id', user.id);
            io.to(user.socketId).emit('user id', user.id);
            io.to(user.room).emit('room data', getRoom(user.room));
            return;
        }
        console.log('do nothing');
    });

    // On disconnect
    socket.on('disconnect', () => {
        // TODO make users in game not dissapear but they can be replaced by a reconnect instead
        removeUser(socket.id, user.room);
        io.to(user.room).emit('room data', getRoom(user.room));
    });

    socket.on('error', (err) => {
        console.log(err);
    });

    socket.on('update game', (game: Partial<Game>) => {
        const room = getRoom(user.room);
        if (!room) return;
        room.game = { ...room.game, ...game };
        // console.log('room game', room.game);
        io.to(user.room).emit('room data', room);
    });

    socket.on('set player name', (name: string) => {
        // Keep name if ''
        if (name === '') return;
        name = name.trim().replace(/ /g, '-');
        // make sure text is only 10 characters
        name = name.substring(0, 10);
        updateUser({ name: name, hasSetName: true }, user);
        // TODO
        io.to(user.room).emit('room data', getRoom(user.room));
    });

    socket.on('set player avatar', (avatar: UserAvatar) => {
        // Don't set avatar if already set
        if (user.userAvatar) return;
        updateUser({ userAvatar: avatar }, user);
        io.to(user.room).emit('room data', getRoom(user.room));
    });

    socket.on('set player rotation', (userId: string, rotation: number) => {
        // find user with userId
        const editingUser = getRoom(user.room)?.users.find(u => u.id === userId);
        if (!editingUser) return;
        editingUser.rotation = rotation;
    });

    socket.on('get room data', () => {
        if (!user.socketId) return;
        console.log('get room data');
        io.to(user.socketId).emit('room data', getRoom(user.room));
    });

    // Tell Host user is ready to start the game
    socket.on('ready', () => {
        io.to(user.room).emit('ready', user.id);
    });

    socket.on('start game', (usersInGame: User[]) => {
        const room = getRoom(user.room);
        // Set ready users to inGame
        room?.users.forEach(u => {
            if (usersInGame.find(uig => u.id === uig.id)) {
                u.inGame = true;
            }
        });
        io.to(user.room).emit('room data', room);
    });

    // TODO use this eventually actually juse the same text
    socket.on('playerDataToHost', (playerData: Partial<PlayerData>) => {
        const hostUser = getRoom(user.room)?.users.find(u => u.isHost);
        if (!hostUser?.socketId) return;
        io.to(hostUser.socketId).emit('playerDataToHost', user.id, playerData);
    });

    socket.on('playerDataToUser', (userId: string, playerData: Partial<PlayerData>) => {
        const userTo = getRoom(user.room)?.users.find(u => u.id === userId);
        if (!userTo?.socketId) return;
        io.to(userTo.socketId).emit('playerDataToUser', playerData);
    });

    socket.on('gameDataToHost', (gameData: Partial<GameData>, updateGameData: boolean) => {
        const hostUser = getRoom(user.room)?.users.find(u => u.isHost);
        if (!hostUser?.socketId) return;
        console.log('gameDataToHost', gameData);
        io.to(hostUser.socketId).emit('gameDataToHost', user.id, gameData, updateGameData);
    });

    socket.on('gameDataToUser', (userId: string, gameData: Partial<GameData>) => {
        // if userId is null then send to all users
        if (userId === null) {
            io.to(user.room).emit('gameDataToUser', gameData);
            return;
        }
        const userTo = getRoom(user.room)?.users.find(u => u.id === userId);
        if (!userTo?.socketId) return;
        io.to(userTo.socketId).emit('gameDataToUser', gameData);
    });

    socket.on('dataToHost', (gameData: Partial<GameData>, playerData: Partial<PlayerData>, updateGameData: boolean) => {
        const hostUser = getRoom(user.room)?.users.find(u => u.isHost);
        if (!hostUser?.socketId) return;
        io.to(hostUser.socketId).emit('dataToHost', user.id, gameData, playerData, updateGameData);
    });

    socket.on('dataToUser', (userId: string, gameData: Partial<GameData>, playerData: Partial<PlayerData>) => {
        const userTo = getRoom(user.room)?.users.find(u => u.id === userId);
        if (!userTo?.socketId) return;
        io.to(userTo.socketId).emit('dataToUser', gameData, playerData);
    });

    // ------------------- Request data from Host -------------------
    // Request data from Host by user
    socket.on("getGameData", () => {
        const hostUser = getRoom(user.room)?.users.find(u => u.isHost);
        if (!hostUser?.socketId) return;
        io.to(hostUser.socketId).emit('getGameData', user.id);
    });

    socket.on('getPlayerData', () => {
        // console.log('getPlayerData requested');
        const hostUser = getRoom(user.room)?.users.find(u => u.isHost);
        if (!hostUser?.socketId) return;
        io.to(hostUser.socketId).emit('getPlayerData', user.id);
    });

    socket.on('getData', () => {
        // console.log('getData requested');
        const hostUser = getRoom(user.room)?.users.find(u => u.isHost);
        if (!hostUser?.socketId) return;
        io.to(hostUser.socketId).emit('getData', user.id);
    });
    // ------------------------------
});
