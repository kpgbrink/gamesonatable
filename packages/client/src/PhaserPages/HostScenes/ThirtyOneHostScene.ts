import { Cards } from "../objects/Cards";
import GameTable from "../objects/GameTable";
import { getScreenCenter, loadIfImageNotLoaded } from "../objects/Tools";
import { ThirtyOneGame } from "./hostObjects/hostGame/ThirtyOneGame";
import HostScene from "./hostObjects/HostScene";
import { HostUserAvatarsAroundTableGame } from "./hostObjects/HostUserAvatars/HostUserAvatarsAroundTable/HostUserAvatarsAroundTableGame";

export default class ThirtyOneHostScene extends HostScene {
    gameTable: GameTable | null = null;
    hostUserAvatars: HostUserAvatarsAroundTableGame;
    thirtyOneGame: ThirtyOneGame;

    constructor() {
        super({ key: 'ThirtyOne' });
        this.hostUserAvatars = new HostUserAvatarsAroundTableGame(this);
        this.thirtyOneGame = new ThirtyOneGame(this);
    }

    preload() {
        loadIfImageNotLoaded(this, 'table', 'assets/images/table.png');
        Cards.preload(this);
        GameTable.preload(this);
    }

    create() {
        super.create();
        this.hostUserAvatars.createOnRoomData();
        this.hostUserAvatars.moveToEdgeOfTable();

        const screenCenter = getScreenCenter(this);
        this.gameTable = new GameTable(this, screenCenter.x, screenCenter.y);
        this.gameTable.setDepth(2);
        this.thirtyOneGame.create();
    }

    update() {
        super.update();
        this.thirtyOneGame.update();
    }
}
