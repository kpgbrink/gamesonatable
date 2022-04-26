import CardContainer from "../../../objects/CardContainer";
import { Transform, transformRelativeToScreenCenter } from "../../../objects/Tools";
import { HostCardGame } from "./HostCardGame";
import { ThirtyOneGameStart } from "./states/hostCardGame/gameSpecificStates/ThirtyOneGameStart";
import { HostGameState } from "./states/HostGameState";


export class ThirtyOneGame extends HostCardGame {
    dealAmount: number = 3;

    deckTransform: Transform;
    cardPlaceTransform: Transform;

    constructor(scene: Phaser.Scene) {
        super(scene);
        this.deckTransform = (() => {
            const transform = { x: -100, y: 0, rotation: 0, scale: 1 };
            return transformRelativeToScreenCenter(this.scene, transform);
        })();
        this.cardPlaceTransform = (() => {
            const transform = { x: 100, y: 0, rotation: 0, scale: 1 };
            return transformRelativeToScreenCenter(this.scene, transform);
        })();
    }

    onCardMoveToTable(userId: string, card: CardContainer): void {
        if (!card) return;
        card.setCardFaceUp(true);
        console.log('move the card to the table yeee');
        card.userHandId = null;
        card.inUserHand = false;
        card.startMovingOverTimeTo(this.cardPlaceTransform, .8, () => {

        });
        const topFaceUpCard = this.cards.getTopFaceUpCard();
        console.log('top face up card', topFaceUpCard?.cardContent);
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