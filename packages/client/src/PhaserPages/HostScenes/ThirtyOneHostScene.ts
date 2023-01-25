import GameTable from "../objects/GameTable";
import { getScreenCenter, loadIfImageNotLoaded } from "../objects/Tools";
import { ThirtyOneGame } from "./hostObjects/hostGame/ThirtyOneGame";
import HostScene from "./hostObjects/HostScene";

export default class ThirtyOneHostScene extends HostScene {
    playerSceneKey: string = "PlayerThirtyOneScene";
    gameTable: GameTable | null = null;
    thirtyOneGame: ThirtyOneGame = new ThirtyOneGame(this);

    count = 0;

    constructor() {
        super({ key: 'ThirtyOneHostScene' });
    }

    preload() {
        loadIfImageNotLoaded(this, 'table', 'assets/images/table.png');
        GameTable.preload(this);
        this.thirtyOneGame?.preload();
    }

    create() {
        super.create();
        console.log('create thirty one game', this.count++);
        const screenCenter = getScreenCenter(this);
        this.gameTable = new GameTable(this, screenCenter.x, screenCenter.y);
        this.gameTable.setDepth(-1);
        this.thirtyOneGame.create();
    }

    update(time: number, delta: number) {
        super.update(time, delta);
        this.thirtyOneGame?.update(time, delta);
    }
}
