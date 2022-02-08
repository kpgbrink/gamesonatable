import { RoomData } from "api";
import Phaser from "phaser";
import socket from "../../SocketConnection";
import { findMyUser } from "../tools/objects/Tools";
import UserAvatarImage, { loadUserAvatarSprites } from "../tools/objects/UserAvatarSprite";
import { onChangeGames } from "../tools/OnChangeGames";

export default class PlayerStartingScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PlayerStartingScene' });
  }

  preload() {
    this.load.atlas('cards', 'assets/cards/cards.png', 'assets/cards/cards.json');
    this.load.html('nameform', 'assets/text/nameform.html');
  }

  create() {
    // this always has to run first
    onChangeGames(this.scene);
    loadUserAvatarSprites(this);
    const screenX = this.cameras.main.worldView.x + this.cameras.main.width;
    const screenY = this.cameras.main.worldView.y + this.cameras.main.height;

    const screenMiddleX = screenX / 2;
    const screenMiddleY = screenY / 2;

    const userAvatarImage = new UserAvatarImage(this, screenMiddleX, screenMiddleY);

    var frames = this.textures.get('cards').getFrameNames();

    var x = 100;
    var y = 100;

    for (var i = 0; i < 64; i++) {
      this.add.image(x, y, 'cards', Phaser.Math.RND.pick(frames)).setInteractive({ draggable: true });
      x += 4;
      y += 4;
    }

    this.input.on('dragstart', (pointer: any, gameObject: any) => {
      this.children.bringToTop(gameObject);
    }, this);

    this.input.on('drag', (pointer: any, gameObject: any, dragX: any, dragY: any) => {
      gameObject.x = dragX;
      gameObject.y = dragY;
    });

    var text = this.add.text(screenX / 2, 10, 'Please enter your name', { color: 'white', fontSize: '20px ' }).setOrigin(0.5);

    var element = this.add.dom(screenX / 2, 150).createFromCache('nameform').setOrigin(0.5);

    element.addListener('click');

    element.on('click', function (this: any, event: any) {
      if (event.target.name === 'playButton') {
        var inputText = this.getChildByName('nameField');

        //  Have they entered anything?
        this.removeListener('click');

        //  Hide the login element
        this.setVisible(false);
        if (inputText.value === '') return;
        //  Populate the text with whatever they typed in
        text.setText('Welcome ' + inputText.value);
        socket.emit('set name', inputText.value);
      }
    });

    socket.on('set name', name => {
      text.setText('Welcome ' + name);
    });

    socket.on('room data', (roomData: RoomData) => {
      const generatedName = findMyUser(roomData)?.name;
      if (generatedName === undefined) return;
      text.setText('Welcome ' + generatedName);
    });
    // socket.emit('get room data');
  }

  update() {

  }
}
