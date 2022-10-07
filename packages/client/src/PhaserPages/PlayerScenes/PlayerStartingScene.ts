import { RoomData } from "api";
import socket from "../../SocketConnection";
import { persistentData } from "../objects/PersistantData";
import { findMyUser, getScreenDimensions, loadIfSpriteSheetNotLoaded, makeMyUserAvatarInCenterOfPlayerScreen } from "../objects/Tools";
import { generateRandomUserAvatar, loadUserAvatarSprites } from "../objects/UserAvatarContainer";
import PlayerMenu from "./playerObjects/PlayerMenu";
import PlayerScene from "./playerObjects/PlayerScene";

export default class PlayerStartingScene extends PlayerScene {
  returnKey: Phaser.Input.Keyboard.Key | null;

  playerMenu: PlayerMenu | null;
  nameFormElement: Phaser.GameObjects.DOMElement | null;

  constructor() {
    super({ key: 'PlayerStartingScene' });
    this.userAvatarContainer = null;
    this.returnKey = null;
    this.playerMenu = null;
    this.nameFormElement = null;
  }

  preload() {
    super.preload();
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
