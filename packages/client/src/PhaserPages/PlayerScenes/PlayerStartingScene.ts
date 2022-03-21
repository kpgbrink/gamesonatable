import { RoomData } from "api";
import socket from "../../SocketConnection";
import { persistentData } from "../tools/objects/PersistantData";
import { addFullScreenButton, findMyUser, getScreenDimensions, loadIfSpriteSheetNotLoaded, makeMyUserAvatarInCenterOfPlayerScreen } from "../tools/objects/Tools";
import UserAvatarContainer, { generateRandomUserAvatar, loadUserAvatarSprites } from "../tools/objects/UserAvatarContainer";
import PlayerScene from "./tools/PlayerScene";

export default class PlayerStartingScene extends PlayerScene {
  userAvatarContainer: UserAvatarContainer | null;
  returnKey: Phaser.Input.Keyboard.Key | null;

  constructor() {
    super({ key: 'PlayerStartingScene' });
    this.userAvatarContainer = null;
    this.returnKey = null;
  }

  preload() {
    this.load.html('nameform', 'assets/text/nameform.html');
    loadIfSpriteSheetNotLoaded(this, 'fullscreen', 'assets/ui/fullscreen.png', { frameWidth: 64, frameHeight: 64 });
    loadIfSpriteSheetNotLoaded(this, 'fullscreen-white', 'assets/ui/fullscreen-white.png', { frameWidth: 64, frameHeight: 64 });
  }

  create() {
    super.create();
    // this always has to run first
    generateRandomUserAvatar();
    loadUserAvatarSprites(this);
    var screenDimensions = getScreenDimensions(this);
    makeMyUserAvatarInCenterOfPlayerScreen(this, this.userAvatarContainer);

    var text = this.add.text(screenDimensions.width / 2, 10, 'Please enter your name', { color: 'white', fontSize: '20px ' }).setOrigin(0.5);

    var element = this.add.dom(screenDimensions.width / 2, 150).createFromCache('nameform').setOrigin(0.5);


    const nameSend = () => {
      var inputText = element.getChildByName('nameField') as HTMLInputElement;
      if (inputText.value === '') return;
      //  Have they entered anything?
      element.removeListener('click');
      //  Hide the login element
      element.setVisible(false);
      //  Populate the text with whatever they typed in
      text.setText('Welcome ' + inputText.value);
      socket.emit('set player name', inputText.value);
    };
    element.addListener('click');
    element.on('click', function (this: any, event: any) {
      if (event.target.name !== 'playButton') return;
      nameSend();
    });
    this.returnKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    this.returnKey.on('down', function (this: any) {
      nameSend();
    });


    socket.on('set player name', name => {
      text.setText('Welcome ' + name);
    });

    (() => {
      const roomData = persistentData.roomData;
      if (!roomData) return;
      const generatedName = findMyUser(roomData)?.name;
      if (!generatedName) return;
      text.setText('Welcome ' + generatedName);
    })();
    socket.on('room data', (roomData: RoomData) => {
      const generatedName = findMyUser(roomData)?.name;
      if (generatedName === undefined) return;
      text.setText('Welcome ' + generatedName);
    });
    addFullScreenButton(this);
  }

  update() {

  }

  destroy() {
    console.log("scene is destroyed");
  }

  shutdown() {
    console.log('SHCENEN ENFEJKL SFDJLKFDS JLKDSF JFD:SLK');
  }
}
