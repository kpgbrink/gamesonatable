import express from 'express';
import { createServer } from "http";
import { Server } from "socket.io";
import { QueryPayLoad } from 'api';
import uniqid from 'uniqid';
import config from 'config';
import cors from 'cors';

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



app.get('/makeRoomId', (req, res) => {
    res.send({ roomId: uniqid() + randomPin() });
});

// Generate random 6 digit number
const randomPin = () => {
    return Math.floor(Math.random() * 900000) + 100000;
};

io.on('connection', (socket) => {
    // The current room I am in
    let roomIn = '';
    socket.on("make new room", (roomId) => {
        socket.leave(roomIn);
        socket.join(roomId);
        console.log('created room', roomId);
        roomIn = roomId;
    });

    socket.on("join room", (roomId) => {
        if (roomId === null) return;
        socket.leave(roomIn);
        socket.join(roomId);
        roomIn = roomId;
        console.log('joined room', roomId);
    });

    // Test chat
    socket.on("chat", (message: string) => {
        console.log(socket.rooms.values());
        var room = socket.rooms.values();
        var rooms = socket.rooms.keys();
        console.log(rooms);
        io.in(roomIn).emit("chat", message);
    });

    // On disconnect
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('error', (err) => {
        console.log(err);
    });
});