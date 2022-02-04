import { UserAvatar } from "api";
import Phaser from "phaser";
import socket from "../../SocketConnection";
import { avatarImages } from "../tools/objects/avatarImages.generated";
import { randomIndex } from "../tools/objects/tools";
import { loadUserAvatarSprites } from "../tools/objects/userAvatarSprite";
import { onChangeGames } from "../tools/OnChangeGames";

export default class PlayerStartingScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PlayerStartingScene' });
  }

  preload() {
    this.load.atlas('cards', 'assets/cards/cards.png', 'assets/cards/cards.json');
    this.load.html('nameform', 'assets/text/nameform.html');
    console.log(avatarImages.base);
    const userAvatar: UserAvatar = {
      base: randomIndex(avatarImages.base),
      beard: randomIndex(avatarImages.beard),
      body: randomIndex(avatarImages.body),
      boots: randomIndex(avatarImages.boots),
      hair: randomIndex(avatarImages.hair),
      head: randomIndex(avatarImages.head),
      legs: randomIndex(avatarImages.legs),
    };
    socket.emit('set avatar', userAvatar);
    loadUserAvatarSprites(this, userAvatar);
  }

  create() {
    onChangeGames(this.scene);
    const screenX = this.cameras.main.worldView.x + this.cameras.main.width;
    const screenY = this.cameras.main.worldView.y + this.cameras.main.height;

    var frames = this.textures.get('cards').getFrameNames();

    var x = 100;
    var y = 100;

    for (var i = 0; i < 64; i++) {
      this.add.image(x, y, 'cards', Phaser.Math.RND.pick(frames)).setInteractive({ draggable: true });
      x += 4;
      y += 4;
    }

    const playerBase = this.add.image(screenX / 2, screenY / 2, 'base');
    const playerBeard = this.add.image(screenX / 2, screenY / 2, 'beard');
    const playerBody = this.add.image(screenX / 2, screenY / 2, 'body');
    const playerBoots = this.add.image(screenX / 2, screenY / 2, 'boots');
    const playerHair = this.add.image(screenX / 2, screenY / 2, 'hair');
    const playerHead = this.add.image(screenX / 2, screenY / 2, 'head');
    const playerLegs = this.add.image(screenX / 2, screenY / 2, 'legs');
    playerBase.scale = 10;
    playerBeard.scale = 10;
    playerBoots.scale = 10;
    playerBody.scale = 10;
    playerHair.scale = 10;
    playerHead.scale = 10;
    playerLegs.scale = 10;

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
        // if (inputText.value !== '') {
        //  Turn off the click events
        this.removeListener('click');

        //  Hide the login element
        this.setVisible(false);

        //  Populate the text with whatever they typed in
        text.setText('Welcome ' + inputText.value);
        socket.emit('set name', inputText.value);
        // }
        // else {
        //   //  Flash the prompt
        //   this.scene.tweens.add({
        //     targets: text,
        //     alpha: 0.2,
        //     duration: 250,
        //     ease: 'Power3',
        //     yoyo: true
        //   });
        // }
      }
    });

    socket.on('set name', name => {
      text.setText('Welcome ' + name);
    });

  }

  update() {

  }
}
