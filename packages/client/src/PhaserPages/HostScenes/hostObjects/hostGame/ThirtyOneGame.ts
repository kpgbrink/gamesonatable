import { CardContent } from "api";
import socket from "../../../../SocketConnection";
import CardContainer from "../../../objects/items/CardContainer";
import { loadIfImageNotLoaded, Transform, transformRelativeToScreenCenter } from "../../../objects/Tools";
import ThirtyOneHostUserAvatarsAroundTableGame from "../HostUserAvatars/HostUserAvatarsAroundTable/ThirtyOneHostUserAvatarsAroundTableGame";
import { HostCardGame } from "./HostCardGame";
import { ThirtyOneGamePlayerTurn } from "./states/hostCardGame/thirtyOneStates/ThirtyOneGamePlayerTurn";
import { ThirtyOneGameStart } from "./states/hostCardGame/thirtyOneStates/ThirtyOneGameStart";
import { ThirtyOneRoundEnd } from "./states/hostCardGame/thirtyOneStates/ThirtyOneRoundEnd";
import { HostGameState } from "./states/HostGameState";


export class ThirtyOneGame extends HostCardGame {
    dealAmount: number = 3;

    hostUserAvatars: ThirtyOneHostUserAvatarsAroundTableGame | null = null;

    deckTransform: Transform = { x: 0, y: 0, rotation: 0, scale: 1 };
    cardPlaceTransform: Transform = { x: 0, y: 0, rotation: 0, scale: 1 };

    knockPlayerId: string | null = null;
    thirtyOnePlayerId: string | null = null;

    preload() {
        super.preload();
        loadIfImageNotLoaded(this.scene, 'bluePokerChip', 'assets/pokerChips/bluePokerChip.png');
    }

    // override this maybe
    createHostUserAvatarsAroundTableGame() {
        this.hostUserAvatars = new ThirtyOneHostUserAvatarsAroundTableGame(this.scene);
        this.hostUserAvatars.createOnRoomData();
        this.hostUserAvatars.moveToEdgeOfTable();
    }

    create() {
        super.create();
        this.hostUserAvatars?.userAvatarContainers.forEach(player => {
            player.create();
        });
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

        socket.on('thirty one round end', (userId: string, cardContent: CardContent) => {
            const user = this.getUser(userId);
            if (!user) return;
            const card = this.cards.getCard(cardContent);
            if (!card) return;
            this.thirtyOnePlayerId = userId;
            this.onCardMoveToTable(userId, card);
            this.changeState(new ThirtyOneRoundEnd(this));
        });
    }

    onCardMoveToTable(userId: string, card: CardContainer): void {
        if (!card) return;
        card.setFaceUp(true);
        card.userHandId = null;
        card.inUserHand = false;
        // get count of face up cards
        const faceUpCards = this.cards.getTableCards().filter(card => card.getFaceUp());
        const faceUpCardsCount = faceUpCards.length;
        const transform = {
            ...this.cardPlaceTransform,
            x: this.cardPlaceTransform.x + (faceUpCardsCount * 2),
            y: this.cardPlaceTransform.y + (faceUpCardsCount * 2),
        };
        card.startMovingOverTimeTo(transform, .8, () => {

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
        this.hostUserAvatars?.update(time, delta);
    }

}