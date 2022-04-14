import socket from "../../../SocketConnection";
import { PlayerCardHand } from "./PlayerCardHand";
import PlayerScene from "./PlayerScene";


export class ThirtyOneCardHand extends PlayerCardHand {
    constructor(scene: PlayerScene) {
        super(scene);
    }

    create() {
        super.create();
        socket.on('thirty one player turn', (playerId: string, shownCard: string, hiddenCard: string, turn: number) => {
            // set the cards to show the player to choose it's cards
        });
    }

}