import { NewRoomId, User, UserAvatar } from 'api';
import config from 'config';
import cors from 'cors';
import express from 'express';
import { Server, Socket } from "socket.io";
import uniqid from 'uniqid';
import { getRoom, getUser, removeUser, upsertUser } from './user';

console.log(config);

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
        socketLeavePreviousRoom(socket, getUser(socket.id));
        user = upsertUser({ id: socket.id, name: '', room: room, isHost: true, userColor: null, userAvatar: null });
        socket.join(user.room);
    });

    socket.on('join room', (room: string) => {
        if (room === null) return;
        socketLeavePreviousRoom(socket, getUser(socket.id));
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
        const removedUser = removeUser(socket.id);
        if (removedUser) {
            io.to(removedUser.room).emit('room data', getRoom(user.room));
        }
    });

    socket.on('error', (err) => {
        console.log(err);
    });

    socket.on('select game', (game: string) => {
        // set room game
        const room = getRoom(user.room);
        if (!room) return;
        room.currentGame = game;
        io.to(user.room).emit('room data', room);
    });

    socket.on('set name', (name: string) => {
        if (name == '') {
            // Keep the weird fantasy name if the user didn't enter a name
            name = user.name;
        }
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