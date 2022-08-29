import { ThirtyOneCardGameData } from "api/src/gameData/gameDatas/specificCardGameDatas/ThirtyOneCardGame";
import { ThirtyOnePlayerCardHandData } from "api/src/playerData/playerDatas/specificPlayerCardHandDatas/ThirtyOnePlayerCardHandData";
import socket from "../../../../SocketConnection";
import CardContainer from "../../../objects/items/CardContainer";
import { loadIfImageNotLoaded, Transform, transformRelativeToScreenCenter } from "../../../objects/Tools";
import { ThirtyOneUserAvatarContainer } from "../../../objects/userAvatarContainer/cardGameUserAvatarContainer/ThirtyOneUserAvatarContainer";
import ThirtyOneHostUserAvatarsAroundTableGame from "../HostUserAvatars/HostUserAvatarsAroundTable/ThirtyOneHostUserAvatarsAroundTableGame";
import { HostCardGame } from "./HostCardGame";
import { ThirtyOneGamePlayerTurn } from "./states/hostCardGame/thirtyOneStates/ThirtyOneGamePlayerTurn";
import { ThirtyOneGameStart } from "./states/hostCardGame/thirtyOneStates/ThirtyOneGameStart";
import { ThirtyOneRoundEnd } from "./states/hostCardGame/thirtyOneStates/ThirtyOneRoundEnd";
import { HostGameState } from "./states/HostGameState";


export class ThirtyOneGame
    extends HostCardGame<ThirtyOneCardGameData, ThirtyOnePlayerCardHandData, ThirtyOneHostUserAvatarsAroundTableGame, ThirtyOneUserAvatarContainer> {

    dealAmount: number = 3;

    hostUserAvatars: ThirtyOneHostUserAvatarsAroundTableGame | null = null;

    deckTransform: Transform = { x: 0, y: 0, rotation: 0, scale: 1 };
    cardPlaceTransform: Transform = { x: 0, y: 0, rotation: 0, scale: 1 };

    knockPlayerId: string | null = null;
    thirtyOnePlayerId: string | null = null;

    updateUserAvatar(userId: string) {
        // TODO make the update thing happen to the thingy
    }

    override getPlayerData(userId: string) {
        const user = this.getUser(userId);
        if (!user) return;
        const playerCardHandState = super.getPlayerData(userId);
        // add the thirty one specific stuff too
        console.log("userState", user);
        return playerCardHandState;
    }

    override getGameData() {
        return this.gameData;
    }

    override listenForGameData(): void {
        socket.on("playerDataToHost", (userId: string, playerData: ThirtyOnePlayerCardHandData) => {
            const user = this.getUser(userId);
            if (!user) return;

        });
    }

    preload() {
        super.preload();
        loadIfImageNotLoaded(this.scene, 'bluePokerChip', 'assets/pokerChips/bluePokerChip.png');
    }

    // override this maybe
    override createHostUserAvatarsAroundTableGame() {
        this.hostUserAvatars = new ThirtyOneHostUserAvatarsAroundTableGame(this.scene);
        this.hostUserAvatars.createOnRoomData();
        this.hostUserAvatars.moveToEdgeOfTable();
        this.hostUserAvatars.userAvatarContainers.forEach(player => {
            player.create();
        });
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
        // also check if the player has 31 and if so, end the round
        const scoresAndCardsThatMatter = ThirtyOneRoundEnd.calculateScoreAndCardsThatMatter(this.cards.getPlayerCards(userId));
        if (scoresAndCardsThatMatter.score === 31) {
            this.thirtyOnePlayerId = userId;
            this.changeState(new ThirtyOneRoundEnd(this));
        }
    }

    createGameState(): HostGameState<ThirtyOnePlayerCardHandData, ThirtyOneCardGameData> {
        return new ThirtyOneGameStart(this);
    }

    update(time: number, delta: number) {
        super.update(time, delta);
        this.hostUserAvatars?.update(time, delta);
    }

    override listenForPlayerData() {
        socket.on("playerDataToHost", (userId: string, playerData: ThirtyOnePlayerCardHandData) => {
            const user = this.getUser(userId);
            if (!user) return;

        });
    }

    // TODO remove this
    sendPlayerPickUpCards() {
        // tell the player that it is their turn
        const hiddenCard = this.cards.getTopFaceDownCard();
        const shownCard = this.cards.getTopFaceUpCard();
        if (!shownCard) {
            console.log("No shown card found");
            return;
        }
        if (!hiddenCard) {
            this.changeState(new ThirtyOneRoundEnd(this));
            return;
        }

        // check if the turn has gone back to the player who knocked. Then need to go to end round state.
        if (this.knockPlayerId === this.currentPlayerTurnId) {
            this.changeState(new ThirtyOneRoundEnd(this));
            return;
        }
        socket.emit("thirty one player turn", this.currentPlayerTurnId, shownCard.id, hiddenCard.id, this.turn, this.knockPlayerId);
    }

} 