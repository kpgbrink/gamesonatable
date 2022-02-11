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
        userAvatar: null
    };

    // The current room I am in
    socket.on('host room', (room: string) => {
        socketLeavePreviousRoom(socket, user);
        user = upsertUser({ id: socket.id, name: '', room: room, isHost: true, userColor: null, userAvatar: null });
        socket.join(user.room);
    });

    socket.on('join room', (room: string) => {
        if (room === null) return;
        socketLeavePreviousRoom(socket, user);
        user = upsertUser({ id: socket.id, name: '', room: room, isHost: false, userColor: null, userAvatar: null });
        socket.join(user.room);
        io.to(user.room).emit('room data', getRoom(user.room));
    });

    // Test chat
    socket.on('chat', (message: string) => {
        if (!user) { console.log('user not found'); return; }
        io.in(user.room).emit("chat", message);
    });

    // On disconnect
    socket.on('disconnect', () => {
        console.log('disconnect', user);
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
        console.log('selectedGame', room.selectedGame);
        io.to(user.room).emit('room data', room);
    });

    socket.on('set current scene', (scene: string) => {
        // set room game
        const room = getRoom(user.room);
        if (!room) return;
        room.currentScene = scene;
        console.log('currentScene', room.currentScene);
        io.to(user.room).emit('room data', room);
    });

    socket.on('set name', (name: string) => {
        // Keep name if ''
        if (name === '') return;
        user = upsertUser({ ...user, name: name })
        // TODO
        io.to(user.room).emit('room data', getRoom(user.room));
        io.to(user.id).emit('set name', name);
    });

    socket.on('set avatar', (avatar: UserAvatar) => {
        user = upsertUser({ ...user, userAvatar: avatar })
        io.to(user.room).emit('room data', getRoom(user.room));
        io.to(user.id).emit('set avatar', avatar);
    });

    socket.on('get room data', () => {
        io.to(user.id).emit('room data', getRoom(user.room));
    });
});