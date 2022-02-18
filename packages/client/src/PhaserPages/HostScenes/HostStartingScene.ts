import { RoomData } from "api";
import Phaser from "phaser";
import socket from "../../SocketConnection";

export default class HostStartingScene extends Phaser.Scene {
    constructor() {
        super({ key: 'HostStartingScene' });

    }

    preload() {
    }

    create() {
        socket.emit('set player current scene', 'BeforeGameStart');
        socket.on('room data', (roomData: RoomData) => {
            console.log('this is the room data', roomData);
        });
        socket.emit('get room data');

    }

    updateFpsText() {
    }

    update() {
    }
}
