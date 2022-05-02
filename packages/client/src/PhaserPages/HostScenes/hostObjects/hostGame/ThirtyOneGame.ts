import socket from "../../../../SocketConnection";
import CardContainer from "../../../objects/CardContainer";
import { Transform, transformRelativeToScreenCenter } from "../../../objects/Tools";
import { HostCardGame } from "./HostCardGame";
import { ThirtyOneGamePlayerTurn } from "./states/hostCardGame/gameSpecificStates/ThirtyOneGamePlayerTurn";
import { ThirtyOneGameStart } from "./states/hostCardGame/gameSpecificStates/ThirtyOneGameStart";
import { HostGameState } from "./states/HostGameState";


export class ThirtyOneGame extends HostCardGame {
    dealAmount: number = 3;

    deckTransform: Transform = { x: 0, y: 0, rotation: 0, scale: 1 };
    cardPlaceTransform: Transform = { x: 0, y: 0, rotation: 0, scale: 1 };

    knockPlayerId: string | null = null;

    playerLives: { [userId: string]: number } = {};

    bluePokerChip: Phaser.GameObjects.Image | null = null;

    constructor(scene: Phaser.Scene) {
        super(scene);

    }

    preload() {
        super.preload();
        // load blue poker chip
        this.scene.load.image('bluePokerChip', 'assets/pokerChips/bluePokerChip.png');
    }

    create() {
        super.create();
        this.deckTransform = (() => {
            const transform = { x: -330, y: 0, rotation: 0, scale: 4 };
            return transformRelativeToScreenCenter(this.scene, transform);
        })();
        this.cardPlaceTransform = (() => {
            const transform = { x: 330, y: 0, rotation: 0, scale: 4 };
            return transformRelativeToScreenCenter(this.scene, transform);
        })();

        socket.on('thirty one knock', (userId: string) => {
            this.knockPlayerId = userId;
            // set next player turn
            this.changeState(new ThirtyOneGamePlayerTurn(this));
        });
        // set 3 lives for each player
        this.hostUserAvatars?.userAvatarContainers.forEach(player => {
            this.playerLives[player.user.id] = 3;
        });
        // start showing the lives of each player
        this.showLivesOfPlayers();
    }

    showLivesOfPlayers() {
        this.hostUserAvatars?.userAvatarContainers.forEach(player => {
            const lives = this.playerLives[player.user.id];
            if (lives) {
                player.showLives(lives);
            }

        });
    }

    onCardMoveToTable(userId: string, card: CardContainer): void {
        if (!card) return;
        card.setFaceUp(true);
        card.userHandId = null;
        card.inUserHand = false;
        card.startMovingOverTimeTo(this.cardPlaceTransform, .8, () => {

        });
        const topFaceUpCard = this.cards.getTopFaceUpCard();
        card.depth = topFaceUpCard ? topFaceUpCard.depth + 1 : 0;
        this.currentState?.onItemMoveToTable();
    }

    createGameState(): HostGameState {
        return new ThirtyOneGameStart(this);
    }

    update(time: number, delta: number) {
        super.update(time, delta);
    }

}