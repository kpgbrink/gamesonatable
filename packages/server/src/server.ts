import { CardContent, Game, NewRoomId, User, UserAvatar, UserBeforeGameStartDataDictionary } from 'api';
import config from 'config';
import cors from 'cors';
import express from 'express';
import { Server, Socket } from "socket.io";
import uniqid from 'uniqid';
import { getRoom, getRoomHostSocketId, removeUser, upsertUser } from './user';

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
        user = upsertUser(user);
        socket.join(user.room);
    });

    socket.on('join room', (room: string, userId: string) => {
        if (room === null) return;
        socketLeavePreviousRoom(socket, user);
        user.isHost = false;
        user.room = room;
        user.id = userId ?? uniqid();
        user = upsertUser(user);
        socket.join(user.room);
        io.to(user.socketId).emit('user id', user.id);
        io.to(user.room).emit('room data', getRoom(user.room));
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
        user = upsertUser({ ...user, name: name, hasSetName: true });
        // TODO
        io.to(user.room).emit('room data', getRoom(user.room));
    });

    socket.on('set player avatar', (avatar: UserAvatar) => {
        console.log('set player avatar', avatar);
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
        console.log(user.id);
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

    socket.on('give card', (userId: string, cardContent: CardContent, timeGivenToUser: number) => {
        const userGivenCard = getRoom(user.room)?.users.find(u => u.id === userId);
        if (!userGivenCard) return;
        io.to(userGivenCard.socketId).emit('give card', cardContent, timeGivenToUser);
    });

    socket.on('thirty one player turn', (currentPlayerTurnId: string, shownCard: CardContent, hiddenCard: CardContent, turn: number, knockPlayerId: string | null) => {
        const userTurn = getRoom(user.room)?.users.find(u => u.id === currentPlayerTurnId);
        if (!userTurn) return;
        io.to(userTurn.socketId).emit('thirty one player turn', currentPlayerTurnId, shownCard, hiddenCard, turn, knockPlayerId);
    });

    socket.on('moveCardToHand', (cardContent: CardContent) => {
        const hostUser = getRoom(user.room)?.users.find(u => u.isHost);
        if (!hostUser) return;
        io.to(hostUser.socketId).emit('moveCardToHand', user.id, cardContent);
    });

    socket.on('moveCardToTable', (cardContent: CardContent) => {
        const hostUser = getRoom(user.room)?.users.find(u => u.isHost);
        if (!hostUser) return;
        io.to(hostUser.socketId).emit('moveCardToTable', user.id, cardContent);
    });

    socket.on('thirty one knock', () => {
        const hostUser = getRoom(user.room)?.users.find(u => u.isHost);
        if (!hostUser) return;
        io.to(hostUser.socketId).emit('thirty one knock', user.id);
    });

    socket.on('moveCardToTable', (cardContent: CardContent, userHandId: string) => {
        const userHand = getRoom(user.room)?.users.find(u => u.id === userHandId);
        if (!userHand) return;
        io.to(userHand.socketId).emit('moveCardToTable', cardContent);
    });

    socket.on('can deal', (userId: string) => {
        const userDeal = getRoom(user.room)?.users.find(u => u.id === userId);
        if (!userDeal) return;
        io.to(userDeal.socketId).emit('can deal', user.id);
    });

    socket.on('deal', (userId: string) => {
        const hostUser = getRoom(user.room)?.users.find(u => u.isHost);
        if (!hostUser) return;
        io.to(hostUser.socketId).emit('deal', userId);
    });

    socket.on('starting to shuffle', () => {
        io.to(user.room).emit('starting to shuffle', user.id);
    });

    socket.on('thirty one round end', (cardContent: CardContent) => {
        const hostUser = getRoom(user.room)?.users.find(u => u.isHost);
        if (!hostUser) return;
        io.to(hostUser.socketId).emit('thirty one round end', user.id, cardContent);
    });

});
