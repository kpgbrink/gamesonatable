import { RoomData } from "api";
import socket from "../../SocketConnection";
import { persistentData } from "../objects/PersistantData";
import { findMyUser, getScreenDimensions, loadIfSpriteSheetNotLoaded, makeMyUserAvatarInCenterOfPlayerScreen } from "../objects/Tools";
import { generateRandomUserAvatar, loadUserAvatarSprites } from "../objects/UserAvatarContainer";
import PlayerMenu from "./playerObjects/PlayerMenu";
import PlayerScene from "./playerObjects/PlayerScene";

export default class PlayerStartingScene extends PlayerScene {
  returnKey: Phaser.Input.Keyboard.Key | null;
  rotateDeviceText: Phaser.GameObjects.Text | null;
  enterFullScreen: Phaser.GameObjects.Text | null;

  playerMenu: PlayerMenu | null;
  nameFormElement: Phaser.GameObjects.DOMElement | null;

  constructor() {
    super({ key: 'PlayerStartingScene' });
    this.userAvatarContainer = null;
    this.returnKey = null;
    this.rotateDeviceText = null;
    this.enterFullScreen = null;
    this.playerMenu = null;
    this.nameFormElement = null;
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
    this.playerMenu = new PlayerMenu(this);
    this.playerMenu.create();
  }

  setUpNameDisplayAndInput() {
    var screenDimensions = getScreenDimensions(this);
    this.nameFormElement = this.add.dom(screenDimensions.width / 2, 150).createFromCache('nameform').setOrigin(0.5);
    if (!this.nameFormElement) return;
    const nameSend = () => {
      if (!this.nameFormElement) return;
      var inputText = this.nameFormElement.getChildByName('nameField') as HTMLInputElement;
      if (inputText.value === '') return;
      //  Have they entered anything?
      this.nameFormElement.removeListener('click');
      //  Hide the login element
      this.nameFormElement.setVisible(false);
      //  Populate the text with whatever they typed in
      socket.emit('set player name', inputText.value);
    };
    this.nameFormElement.addListener('click');
    this.nameFormElement.on('click', function (this: any, event: any) {
      if (event.target.name !== 'playButton') return;
      nameSend();
    });

    // move element to bottom
    this.nameFormElement.y = screenDimensions.height - 150;

    // switch spaces with understore on typing
    this.input.keyboard.on('keydown', (event: any) => {
      if (!this.nameFormElement) return;
      var inputText = this.nameFormElement.getChildByName('nameField') as HTMLInputElement;
      if (event.keyCode === 32) {
        // remove space
        event.preventDefault();
        inputText.value += '_';
      }
      // if larger than 10 characters, remove last character
      if (inputText.value.length > 10) {
        inputText.value = inputText.value.substring(0, 10);
      }
    });

    this.returnKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    this.returnKey.on('down', function (this: any) {
      nameSend();
    });
    (() => {
      const roomData = persistentData.roomData;
      this.setUserNames(roomData);
    })();
    socket.on('room data', (roomData: RoomData) => {
      this.setUserNames(roomData);
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
    this.enterFullScreen = this.add.text(screenDimensions.width / 2, screenDimensions.height - 50, 'Press icon on top right to enter full screen',
      { color: 'grey', fontSize: '50px' }).setOrigin(0.5);
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
    this.rotateDeviceText = this.add.text(screenDimensions.width / 2, screenDimensions.height - 50, 'Please rotate your device',
      { color: 'grey', fontSize: '80px' }).setOrigin(0.5);
    this.toggleSuggestionsShown();
    const onWindowChange = () => {
      this.toggleSuggestionsShown();
    };
    window.addEventListener('resize', onWindowChange);
    this.events.on('shutdown', () => {
      window.removeEventListener('resize', onWindowChange);
    });
  }

  toggleSuggestionsShown() {
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

  setUserNames(roomData: RoomData | null) {
    if (!roomData) return;
    const myUser = findMyUser(roomData);
    if (!myUser) return;
    const generatedName = myUser.name;
    if (!generatedName) return;
    if (!this.userAvatarContainer) return;
    this.userAvatarContainer.setUserName(generatedName);
  }

  update(time: number, delta: number) {
    this.playerMenu?.update(time, delta);
  }
}
