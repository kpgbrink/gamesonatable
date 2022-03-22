import { RoomData } from "api";
import socket from "../../SocketConnection";
import { persistentData } from "../tools/objects/PersistantData";
import { addFullScreenButton, findMyUser, getScreenDimensions, loadIfSpriteSheetNotLoaded, makeMyUserAvatarInCenterOfPlayerScreen } from "../tools/objects/Tools";
import { generateRandomUserAvatar, loadUserAvatarSprites } from "../tools/objects/UserAvatarContainer";
import PlayerScene from "./tools/PlayerScene";

export default class PlayerStartingScene extends PlayerScene {
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
    makeMyUserAvatarInCenterOfPlayerScreen(this);

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
    (() => {
      const roomData = persistentData.roomData;
      this.setUserNames(roomData, text);
    })();
    socket.on('room data', (roomData: RoomData) => {
      this.setUserNames(roomData, text);
    });
    addFullScreenButton(this);
  }

  setUserNames(roomData: RoomData | null, text: Phaser.GameObjects.Text) {
    if (!roomData) return;
    const myUser = findMyUser(roomData);
    if (!myUser) return;
    const generatedName = myUser.name;
    if (!generatedName) return;
    text.setText('Welcome ' + generatedName);
    console.log('my user avatar container', this.userAvatarContainer);
    if (!this.userAvatarContainer) return;
    this.userAvatarContainer.setUserName(generatedName);
  }

  update() {

  }
}
