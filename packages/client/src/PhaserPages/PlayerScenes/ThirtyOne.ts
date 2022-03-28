import PlayerScene from "./tools/PlayerScene";


export default class ThirtyOne extends PlayerScene {
    constructor() {
        super({ key: 'ThirtyOne' });
    }

    create() {
        super.create();
        // display the Phaser.VERSION
        console.log('thirty one is running');
    }

    update() {
    }
}
