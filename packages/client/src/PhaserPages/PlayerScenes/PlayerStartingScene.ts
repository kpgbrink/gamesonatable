import { RoomData } from "api";
import Phaser from "phaser";
import socket from "../../SocketConnection";
import { persistentData } from "../tools/objects/PersistantData";
import { findMyUser } from "../tools/objects/Tools";
import UserAvatarContainer, { generateRandomUserAvatar, loadUserAvatarSprites, makeMyUserAvatar } from "../tools/objects/UserAvatarContainer";
import { onChangeGames } from "./tools/OnChangeGames";

export default class PlayerStartingScene extends Phaser.Scene {
  userAvatarContainer: UserAvatarContainer | null;

  constructor() {
    super({ key: 'PlayerStartingScene' });
    this.userAvatarContainer = null;
  }

  preload() {
    this.load.html('nameform', 'assets/text/nameform.html');
  }

  create() {
    // this always has to run first
    onChangeGames(this.scene);
    generateRandomUserAvatar();
    loadUserAvatarSprites(this);
    const screenX = this.cameras.main.worldView.x + this.cameras.main.width;
    const screenY = this.cameras.main.worldView.y + this.cameras.main.height;

    const screenMiddleX = screenX / 2;
    const screenMiddleY = screenY / 2;

    // Load my user avatar.
    (() => {
      this.userAvatarContainer = null;
      this.userAvatarContainer = makeMyUserAvatar(this, screenMiddleX, screenMiddleY, this.userAvatarContainer) || this.userAvatarContainer;
      socket.on('connect', () => {
        this.userAvatarContainer = makeMyUserAvatar(this, screenMiddleX, screenMiddleY, this.userAvatarContainer) || this.userAvatarContainer;
        console.log(this.userAvatarContainer);
      });
    })()

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
  }

  update() {

  }

  destroy() {
    console.log("scene is destroyed");
  }
}
