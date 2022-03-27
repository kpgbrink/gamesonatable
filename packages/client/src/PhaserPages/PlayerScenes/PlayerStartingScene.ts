import { RoomData } from "api";
import socket from "../../SocketConnection";
import { persistentData } from "../tools/objects/PersistantData";
import { findMyUser, getScreenDimensions, loadIfSpriteSheetNotLoaded, makeMyUserAvatarInCenterOfPlayerScreen } from "../tools/objects/Tools";
import { generateRandomUserAvatar, loadUserAvatarSprites } from "../tools/objects/UserAvatarContainer";
import PlayerScene from "./tools/PlayerScene";

export default class PlayerStartingScene extends PlayerScene {
  returnKey: Phaser.Input.Keyboard.Key | null;
  rotateDeviceText: Phaser.GameObjects.Text | null;
  enterFullScreen: Phaser.GameObjects.Text | null;


  constructor() {
    super({ key: 'PlayerStartingScene' });
    this.userAvatarContainer = null;
    this.returnKey = null;
    this.rotateDeviceText = null;
    this.enterFullScreen = null;
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
    makeMyUserAvatarInCenterOfPlayerScreen(this);
    this.setUpNameDisplayAndInput();
    this.setUpRotateDeviceText();
    this.setUpFullScreenDeviceText();
  }

  setUpNameDisplayAndInput() {
    var screenDimensions = getScreenDimensions(this);
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
  }

  toggleFullScreenVisible() {
    if (!this.enterFullScreen) return;
    if (this.rotateDeviceText?.visible || this.scale.isFullscreen) {
      this.enterFullScreen.visible = false;
    } else {
      this.enterFullScreen.visible = true;
    }
  }

  setUpFullScreenDeviceText() {
    var screenDimensions = getScreenDimensions(this);
    this.enterFullScreen = this.add.text(screenDimensions.width / 2, screenDimensions.height - 200, 'Press icon on top right to enter full screen',
      { color: 'white', fontSize: '50px' }).setOrigin(0.5);
    this.enterFullScreen.setVisible(false);
    this.toggleFullScreenVisible();
    this.scale.on(Phaser.Scale.Events.ENTER_FULLSCREEN, () => {
      this.toggleFullScreenVisible();
    });

    this.scale.on(Phaser.Scale.Events.LEAVE_FULLSCREEN, () => {
      this.toggleFullScreenVisible();
    });
  }

  setUpRotateDeviceText() {
    var screenDimensions = getScreenDimensions(this);
    this.rotateDeviceText = this.add.text(screenDimensions.width / 2, screenDimensions.height - 200, 'Please rotate your device',
      { color: 'white', fontSize: '80px' }).setOrigin(0.5);
    this.showSuggestionToRotateDevice();
    const onWindowChange = () => {
      this.showSuggestionToRotateDevice();
    };
    window.addEventListener('resize', onWindowChange);
    this.events.on('shutdown', () => {
      window.removeEventListener('resize', onWindowChange);
    });
  }

  showSuggestionToRotateDevice() {
    var newWidth = window.innerWidth;
    var newHeight = window.innerHeight;
    if (!this) return;
    if (newHeight > newWidth) {
      this.rotateDeviceText?.setVisible(true);
      this.toggleFullScreenVisible();
    } else {
      this.rotateDeviceText?.setVisible(false);
      this.toggleFullScreenVisible();
    }
  }

  setUserNames(roomData: RoomData | null, text: Phaser.GameObjects.Text) {
    if (!roomData) return;
    const myUser = findMyUser(roomData);
    if (!myUser) return;
    const generatedName = myUser.name;
    if (!generatedName) return;
    text.setText('Welcome ' + generatedName);
    if (!this.userAvatarContainer) return;
    this.userAvatarContainer.setUserName(generatedName);
  }



  update() {

  }
}
