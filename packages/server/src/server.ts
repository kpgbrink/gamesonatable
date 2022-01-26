import express from 'express';
import { Server, Socket } from "socket.io";
import { NewRoomId, RoomData, User } from 'api';
import uniqid from 'uniqid';
import config from 'config';
import cors from 'cors';
import { upsertUser, removeUser, getUser, getUsersInRoom } from './user';

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
        isHost: false
    };
    // The current room I am in
    socket.on('host room', (room: string) => {
        socketLeavePreviousRoom(socket, getUser(socket.id));
        user = upsertUser({ id: socket.id, name: '', room: room, isHost: true });
        socket.join(user.room);
    });

    socket.on('join room', (room: string) => {
        if (room === null) return;
        socketLeavePreviousRoom(socket, getUser(socket.id));
        user = upsertUser({ id: socket.id, name: '', room: room, isHost: false });
        socket.join(user.room);
        const roomData: RoomData = {
            room: room,
            users: getUsersInRoom(room)
        };
        io.to(user.room).emit('room data', roomData);
    });

    // Test chat
    socket.on('chat', (message: string) => {
        // const user = getUser(socket.id);
        if (!user) { console.log('user not found'); return; }
        io.in(user.room).emit("chat", message);
    });

    // On disconnect
    socket.on('disconnect', () => {
        const removedUser = removeUser(socket.id);
        if (removedUser) {
            const roomData: RoomData = {
                room: removedUser.room,
                users: getUsersInRoom(removedUser.room)
            };
            io.to(removedUser.room).emit('room data', roomData);
        }
    });

    socket.on('error', (err) => {
        console.log(err);
    });

    socket.on('select game', (game: string) => {
        io.in(user.room).emit("select game", game);
    });
});