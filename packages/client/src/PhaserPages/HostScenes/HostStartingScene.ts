import { RoomData } from "api";
import Phaser from "phaser";
import socket from "../../SocketConnection";

export default class HostStartingScene extends Phaser.Scene {
    constructor() {
        super({ key: 'HostStartingScene' });

    }

    preload() {
        this.load.atlas('cards', 'assets/cards/cards.png', 'assets/cards/cards.json');
    }

    create() {
        socket.emit('set player current scene', 'BeforeGameStart');
        socket.on('room data', (roomData: RoomData) => {
            console.log('this is the room data', roomData);
        });
        socket.emit('get room data');

        var frames = this.textures.get('cards').getFrameNames();

        var x = 100;
        var y = 100;

        for (var i = 0; i < 10; i++) {
            var image = this.add.image(x, y, 'cards', Phaser.Math.RND.pick(frames)).setInteractive({ draggable: true });

            x += 4;
            y += 4;
        }

        this.input.on('dragstart', function (this: any, pointer: any, gameObject: any) {

            this.children.bringToTop(gameObject);

        }, this);

        this.input.on('drag', function (pointer: any, gameObject: any, dragX: number, dragY: number) {

            gameObject.x = dragX;
            gameObject.y = dragY;

        });
    }

    updateFpsText() {
    }

    update() {
    }
}
