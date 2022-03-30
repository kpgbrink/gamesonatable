import { RoomData } from "api";
import socket from "../../SocketConnection";
import CardContainer, { cards, suites } from "../tools/objects/CardContainer";
import { getScreenCenter, loadIfImageNotLoaded } from "../tools/objects/Tools";
import UserAvatarContainer from "../tools/objects/UserAvatarContainer";
import HostScene from "./tools/HostScene";
import { addUserAvatars, createTable, moveUserAvatarToProperTableLocation, UserAvatarScene } from "./tools/HostTools";

export default class ThirtyOneHostScene extends HostScene implements UserAvatarScene {
    userAvatars: UserAvatarContainer[] = [];
    cardContainers: CardContainer[] = [];

    constructor() {
        super({ key: 'ThirtyOne' });
    }

    preload() {
        this.load.atlas('cards', 'assets/cards/cards.png', 'assets/cards/cards.json');
        loadIfImageNotLoaded(this, 'table', 'assets/images/table.png');
    }

    addCardImages() {
        const screenCenter = getScreenCenter(this);
        // create the cards
        for (let suite of suites) {
            for (let card of cards) {
                const cardContainer = new CardContainer(this, screenCenter.x, screenCenter.y, suite, card);
                this.cardContainers.push(cardContainer);
                this.add.existing(cardContainer);
                cardContainer.setCardVelocity(Math.random() * 2, Math.random() * 2);
            }
        }
    }

    create() {
        super.create();
        console.log('thirty one is running');
        // display the Phaser.VERSION
        createTable(this);
        socket.on('room data', (roomData: RoomData) => {
            addUserAvatars(this, roomData, { onlyThoseInGame: true });
            // moveUserAvatars to proper locations
            moveUserAvatarToProperTableLocation(this);
        });
        this.addCardImages();
    }

    update() {
        super.update();
        this.cardContainers.forEach(cardContainer => cardContainer.update());
    }
}
