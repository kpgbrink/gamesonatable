import { Cards } from "../objects/Cards";
import GameTable from "../objects/GameTable";
import { getScreenCenter, loadIfImageNotLoaded } from "../objects/Tools";
import { ThirtyOneGame } from "./hostObjects/hostGame/ThirtyOneGame";
import HostScene from "./hostObjects/HostScene";

export default class ThirtyOneHostScene extends HostScene {
    gameTable: GameTable | null = null;
    thirtyOneGame: ThirtyOneGame;

    constructor() {
        super({ key: 'ThirtyOne' });
        this.thirtyOneGame = new ThirtyOneGame(this);
    }

    preload() {
        loadIfImageNotLoaded(this, 'table', 'assets/images/table.png');
        Cards.preload(this);
        GameTable.preload(this);
        this.thirtyOneGame?.preload();
    }

    create() {
        super.create();
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
