import express from 'express';
import { Server, Socket } from "socket.io";
import { QueryPayLoad, RoomData, UserLeft } from 'api';
import uniqid from 'uniqid';
import config from 'config';
import cors from 'cors';
import { upsertUser, removeUser, getUser, getUsersInRoom, getUserCount } from './user';

console.log(config);

const app = express();
const port = 3001;

const httpServer = app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
const io = new Server(httpServer, {
    cors: config.get('cors.origin')
});

app.use(cors({ origin: config.get('cors.origin'), credentials: config.get('cors.credentials') }));

app.get("/data", (req, res) => {

    const data: QueryPayLoad = { foo: "bar" };

    res.json({ foo: "barsdsdf" });
});

app.get('/getNewRoomId', (req, res) => {
    res.send({ roomId: uniqid() + randomPin() });
});

// Generate random 6 digit number
const randomPin = () => {
    return Math.floor(Math.random() * 900000) + 100000;
};

const socketLeaveAllRooms = (socket: Socket) => {
    Object.keys(socket.rooms)
        .filter(it => it !== socket.id)
        .forEach(id => {
            console.log("Leaving room: " + id);
            socket.leave(id)
        });
}

io.on('connection', (socket) => {
    // The current room I am in
    socket.on('host room', (room: string) => {
        socketLeaveAllRooms(socket);
        var user = upsertUser({ id: socket.id, name: '', room: room, isHost: true });
        socket.join(user.room);
        console.log('created room', user.room);
        console.log(getUsersInRoom(user.room));
    });

    socket.on('join room', (room: string) => {
        console.log('hi');
        if (room === null) return;
        socketLeaveAllRooms(socket);
        var user = upsertUser({ id: socket.id, name: '', room: room, isHost: false });
        socket.join(user.room);
        console.log('joined room', room);
        const roomData: RoomData = {
            room: room,
            users: getUsersInRoom(room)
        };
        io.to(user.room).emit('room data', roomData);
        console.log(roomData);
    });

    // Test chat
    socket.on('chat', (message: string) => {
        // console.log(getUserCount());
        const user = getUser(socket.id);
        if (!user) { console.log('user not found'); return; }
        io.in(user.room).emit("chat", message);
    });

    // On disconnect
    socket.on('disconnect', () => {
        const userCount = getUserCount();
        console.log('user disconnected', socket.id);
        const user = removeUser(socket.id);
        console.log('delete user', user);
        if (user) {
            const userLeft: UserLeft = {
                id: user.id
            };
            io.to(user.room).emit('user left', userLeft);
        }
        console.log('old user count', userCount);
        console.log('new user count', getUserCount());
    });

    socket.on('error', (err) => {
        console.log(err);
    });
});