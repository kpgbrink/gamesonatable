import Phaser from "phaser";
import socket from "../../../SocketConnection";
import { addFullScreenButton, loadIfImageNotLoaded, loadIfSpriteSheetNotLoaded, socketOffOnSceneShutdown } from "../../objects/Tools";
import UserAvatarContainer, { preloadUserAvatarSprites } from "../../objects/UserAvatarContainer";
import { onPlayerChangeGames } from "../playerTools/OnPlayerChangeGames";


export default class PlayerScene extends Phaser.Scene {
    userAvatarContainer: UserAvatarContainer | null;

    constructor(config: Phaser.Types.Scenes.SettingsConfig) {
        super(config);
        this.userAvatarContainer = null;
    }

    preload() {
        this.loadCreateMenuImages();
        loadIfSpriteSheetNotLoaded(this, 'fullscreen', 'assets/ui/fullscreen.png', { frameWidth: 64, frameHeight: 64 });
        loadIfSpriteSheetNotLoaded(this, 'fullscreen-white', 'assets/ui/fullscreen-white.png', { frameWidth: 64, frameHeight: 64 });
        preloadUserAvatarSprites(this);
        loadIfImageNotLoaded(this, 'menuButton', 'assets/ui/menuButton.png');
    }

    create() {
        socket.off();
        onPlayerChangeGames(this);
        socketOffOnSceneShutdown(this);
        addFullScreenButton(this);
        socket.emit('get room data');
        this.scale.refresh();
        // add scale refresh event listener
        console.log('make player scene event');
        window.addEventListener('resizeSpecial', (e: any) => {
            console.log('resizeSpecial event happened');
            this.scale.refresh();
        });
        this.createMenu();
    }

    loadCreateMenuImages() {

    }

    createMenu() {
        // make a button at the top left of screen that opens a dropdown menu
        const menuButton = this.add.image(0, 0, 'menuButton').setOrigin(0, 0);
        menuButton.setInteractive();

        // create menu buttons that become visible when menu button is pressed
        // Settings button
        // Restart Game
        // Quit Game
        // make the buttons



        menuButton.on('pointerdown', () => {

        });
    }

    // remove resize event listener on shutdown
    shutdown() {
        console.log('scene shutdown');
        // window.removeEventListener('resizeSpecial', () => { });
    }
}
