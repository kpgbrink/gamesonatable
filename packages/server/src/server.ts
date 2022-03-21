import { NewRoomId, User, UserAvatar } from 'api';
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
    };

    // The current room I am in
    socket.on('host room', (room: string) => {
        socketLeavePreviousRoom(socket, user);
        user = upsertUser({ id: socket.id, name: '', room: room, isHost: true, userColor: null, userAvatar: null, rotation: null });
        socket.join(user.room);
    });

    socket.on('join room', (room: string) => {
        if (room === null) return;
        socketLeavePreviousRoom(socket, user);
        user = upsertUser({ id: socket.id, name: '', room: room, isHost: false, userColor: null, userAvatar: null, rotation: null });
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
        io.to(user.id).emit('set player name', name);
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
        upsertUser(editingUser);
    });

    socket.on('get room data', () => {
        io.to(user.id).emit('room data', getRoom(user.room));
    });
});