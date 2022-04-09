import { CardContent, NewRoomId, User, UserAvatar, UserBeforeGameStartDataDictionary } from 'api';
import config from 'config';
import cors from 'cors';
import express from 'express';
import { Server, Socket } from "socket.io";
import uniqid from 'uniqid';
import { getRoom, removeUser, upsertUser } from './user';

const app = express();
const port = 3001;

const httpServer = app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
const io = new Server(httpServer, {
    cors: config.get('cors.origin'),
    pingInterval: 20000,
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
        id: socket.id,
        name: '',
        room: '',
        isHost: false,
        userColor: null,
        userAvatar: null,
        rotation: null,
        inGame: false,
    };

    // The current room I am in
    socket.on('host room', (room: string) => {
        socketLeavePreviousRoom(socket, user);
        user.isHost = true;
        user.room = room;
        user = upsertUser(user);
        socket.join(user.room);
    });

    socket.on('join room', (room: string) => {
        if (room === null) return;
        socketLeavePreviousRoom(socket, user);
        user.isHost = false;
        user.room = room;
        user = upsertUser(user);
        socket.join(user.room);
        io.to(user.room).emit('room data', getRoom(user.room));
    });

    // On disconnect
    socket.on('disconnect', () => {
        removeUser(socket.id, user.room);
        io.to(user.room).emit('room data', getRoom(user.room));
    });

    socket.on('error', (err) => {
        console.log(err);
    });

    socket.on('select game', (game: string) => {
        // set room game
        const room = getRoom(user.room);
        if (!room) return;
        room.selectedGame = game;
        io.to(user.room).emit('room data', room);
    });

    socket.on('set player current scene', (scene: string) => {
        // set room game
        const room = getRoom(user.room);
        if (!room) return;
        room.currentPlayerScene = scene;
        io.to(user.room).emit('room data', room);
    });

    socket.on('set player name', (name: string) => {
        // Keep name if ''
        if (name === '') return;
        user = upsertUser({ ...user, name: name })
        // TODO
        io.to(user.room).emit('room data', getRoom(user.room));
    });

    socket.on('set player avatar', (avatar: UserAvatar) => {
        // Don't set avatar if already set
        if (user.userAvatar) return;
        user = upsertUser({ ...user, userAvatar: avatar });
        io.to(user.room).emit('room data', getRoom(user.room));
    });

    socket.on('set player rotation', (userId: string, rotation: number) => {
        // find user with userId
        const editingUser = getRoom(user.room)?.users.find(u => u.id === userId);
        if (!editingUser) return;
        editingUser.rotation = rotation;
    });

    socket.on('get room data', () => {
        io.to(user.id).emit('room data', getRoom(user.room));
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

    socket.on('give card', (userId: string, cardContent: CardContent) => {
        console.log('give card', userId, cardContent);
        io.to(user.room).emit('gie card', cardContent);
    });

});
