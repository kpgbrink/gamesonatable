import { Cards } from "../objects/Cards";
import GameTable from "../objects/GameTable";
import { getScreenCenter, loadIfImageNotLoaded } from "../objects/Tools";
import HostScene from "./hostObjects/HostScene";
import { HostUserAvatarsAroundTableGame } from "./hostObjects/HostUserAvatars/HostUserAvatarsAroundTable/HostUserAvatarsAroundTableGame";

export default class ThirtyOneHostScene extends HostScene {
    cards: Cards
    gameTable: GameTable | null = null;
    hostUserAvatars: HostUserAvatarsAroundTableGame;

    constructor() {
        super({ key: 'ThirtyOne' });
        this.cards = new Cards(this);
        this.hostUserAvatars = new HostUserAvatarsAroundTableGame(this);
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
        this.cards.create(screenCenter.x, screenCenter.y);
        this.cards.setDepth(3);
    }

    update() {
        super.update();
        this.cards.update();
    }
}
