import { RoomData } from "api";
import socket from "../../SocketConnection";
import { persistentData } from "../tools/objects/PersistantData";
import { addFullScreenButton, findMyUser, getScreenDimensions, loadIfNotLoaded, makeMyUserAvatarInCenterOfPlayerScreen } from "../tools/objects/Tools";
import UserAvatarContainer, { generateRandomUserAvatar, loadUserAvatarSprites } from "../tools/objects/UserAvatarContainer";
import PlayerScene from "./tools/PlayerScene";

export default class PlayerStartingScene extends PlayerScene {
  userAvatarContainer: UserAvatarContainer | null;

  constructor() {
    super({ key: 'PlayerStartingScene' });
    this.userAvatarContainer = null;
  }

  preload() {
    this.load.html('nameform', 'assets/text/nameform.html');
    loadIfNotLoaded(this, 'fullscreen', 'assets/ui/fullscreen.png');
    loadIfNotLoaded(this, 'fullscreen-white', 'assets/ui/fullscreen-white.png');
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
        socket.emit('set player name', inputText.value);
      }
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
