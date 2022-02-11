import Phaser from "phaser";
import { persistentData } from "../tools/objects/PersistantData";
import { findMyUser } from "../tools/objects/Tools";
import { onChangeGames } from "./tools/OnChangeGames";

export default class BeforeGameStart extends Phaser.Scene {
    constructor() {
        super({ key: 'BeforeGameStart' });
    }

    preload() {
        this.load.atlas('cards', 'assets/cards/cards.png', 'assets/cards/cards.json');
    }

    create() {
        console.log('before game start');
        // this always has to run first
        onChangeGames(this.scene);
        // loadUserAvatarSprites(this);
        const screenX = this.cameras.main.worldView.x + this.cameras.main.width;
        const screenY = this.cameras.main.worldView.y + this.cameras.main.height;

        const screenMiddleX = screenX / 2;
        const screenMiddleY = screenY / 2;

        // const userAvatarImage = new UserAvatarImage(this, screenMiddleX, screenMiddleY);

        var text = (() => {
            if (!persistentData.roomData) return;
            const text = `${findMyUser(persistentData.roomData)?.name}`;
            return this.add.text(screenX / 2, 10, `${text}`, { color: 'white', fontSize: '20px ' }).setOrigin(0.5);
        })();

        var frames = this.textures.get('cards').getFrameNames();

        var x = 100;
        var y = 100;

        for (var i = 0; i < 10; i++) {
            var image = this.add.image(x, y, 'cards', Phaser.Math.RND.pick(frames)).setInteractive({ draggable: true });

            x += 4;
            y += 4;
        }

    }

    update() {

    }
}
