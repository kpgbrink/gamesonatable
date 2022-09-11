import { Game, NewRoomId, StoredBrowserIds, User, UserAvatar, UserBeforeGameStartDataDictionary } from 'api';
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

    // The current room I am in
    socket.on('host room', (room: string) => {
        console.log('start hosting room', room);
        socketLeavePreviousRoom(socket, user);
        // ensure there is only one host
        const previousHost = getRoomHostSocketId(room);
        if (previousHost) {
            console.log('remove previous host');
            removeUser(previousHost, room);
        }
        user.isHost = true;
        user.room = room;
        user = addUserToRoom(user);
        socket.join(user.room);
    });

    socket.on('join room', (room: string, userId: string, storedIds: StoredBrowserIds) => {
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
        if (!roomData) {
            socket.emit('room does not exist', room);
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
        io.to(user.room).emit('room data', room);
    });

    socket.on('set player name', (name: string) => {
        // Keep name if ''
        if (name === '') return;
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

    // Host tells user it is ready to start the game
    socket.on('userBeforeGameStart data', (userBeforeGameStartDictionary: UserBeforeGameStartDataDictionary) => {
        const room = getRoom(user.room);
        if (!room) return;
        io.to(user.room).emit('userBeforeGameStart data', userBeforeGameStartDictionary);
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
        io.to(hostUser.socketId).emit('playerDataToHost', playerData);
    });

    socket.on('playerDataToUser', (userId: string, playerData: Partial<PlayerData>) => {
        const userTo = getRoom(user.room)?.users.find(u => u.id === userId);
        if (!userTo?.socketId) return;
        io.to(userTo.socketId).emit('playerDataToUser', playerData);
    });

    socket.on('gameDataToHost', (gameData: Partial<GameData>) => {
        const hostUser = getRoom(user.room)?.users.find(u => u.isHost);
        if (!hostUser?.socketId) return;
        io.to(hostUser.socketId).emit('gameDataToHost', user.id, gameData);
    });

    socket.on('gameDataToUser', (userId: string, gameData: Partial<GameData>) => {
        const userTo = getRoom(user.room)?.users.find(u => u.id === userId);
        if (!userTo?.socketId) return;
        io.to(userTo.socketId).emit('gameDataToUser', gameData);
    });

    socket.on('dataToHost', (gameData: Partial<GameData>, playerData: Partial<PlayerData>) => {
        const hostUser = getRoom(user.room)?.users.find(u => u.isHost);
        if (!hostUser?.socketId) return;
        io.to(hostUser.socketId).emit('dataToHost', gameData, playerData);
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
        console.log('getPlayerData requested');
        const hostUser = getRoom(user.room)?.users.find(u => u.isHost);
        if (!hostUser?.socketId) return;
        io.to(hostUser.socketId).emit('getPlayerData', user.id);
    });

    socket.on('getData', () => {
        console.log('getData requested');
        const hostUser = getRoom(user.room)?.users.find(u => u.isHost);
        if (!hostUser?.socketId) return;
        io.to(hostUser.socketId).emit('getData', user.id);
    });
    // ------------------------------

    // Work on removing the commented out code below

    // socket.on('thirty one player turn', (gameData.playerTurnId: string, shownCard: number, hiddenCard: number, turn: number, knockPlayerId: string | null) => {
    //     const userTurn = getRoom(user.room)?.users.find(u => u.id === gameData.playerTurnId);
    //     if (!userTurn?.socketId) return;
    //     io.to(userTurn.socketId).emit('thirty one player turn', gameData.playerTurnId, shownCard, hiddenCard, turn, knockPlayerId);
    // });

    // socket.on('moveCardToHand', (cardId: number) => {
    //     const hostUser = getRoom(user.room)?.users.find(u => u.isHost);
    //     if (!hostUser?.socketId) return;
    //     io.to(hostUser.socketId).emit('moveCardToHand', user.id, cardId);
    // });

    // socket.on('moveCardToTable', (cardId: number) => {
    //     const hostUser = getRoom(user.room)?.users.find(u => u.isHost);
    //     if (!hostUser?.socketId) return;
    //     io.to(hostUser.socketId).emit('moveCardToTable', user.id, cardId);
    // });

    // socket.on('thirty one knock', () => {
    //     const hostUser = getRoom(user.room)?.users.find(u => u.isHost);
    //     if (!hostUser?.socketId) return;
    //     io.to(hostUser.socketId).emit('thirty one knock', user.id);
    // });

    // socket.on('can deal', (userId: string) => {
    //     const userDeal = getRoom(user.room)?.users.find(u => u.id === userId);
    //     if (!userDeal?.socketId) return;
    //     io.to(userDeal.socketId).emit('can deal', user.id);
    // });

    // socket.on('deal', (userId: string) => {
    //     const hostUser = getRoom(user.room)?.users.find(u => u.isHost);
    //     if (!hostUser?.socketId) return;
    //     io.to(hostUser.socketId).emit('deal', userId);
    // });

    // socket.on('starting to shuffle', () => {
    //     io.to(user.room).emit('starting to shuffle', user.id);
    // });


});
