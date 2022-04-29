import CardContainer from "../../../../../../objects/CardContainer";
import { ThirtyOneGame } from "../../../ThirtyOneGame";
import { HostGameState } from "../../HostGameState";

// Bring cards to the random dealer and have the cards start going out to people.
export class ThirtyOneRoundEnd extends HostGameState {
    hostGame: ThirtyOneGame;
    bringShownCardToPositionTime: number = 1;

    constructor(hostGame: ThirtyOneGame) {
        super(hostGame);
        this.hostGame = hostGame;
    }

    enter() {
        // display the player's cards and their scores.
        console.log('show the scores of the player cards');
        // increate the size of the cards in player hands and make them face up
        console.log('increase the size of the cards in player hands and make them face up');
        this.hostGame.cards.cardContainers.filter(c => c.userHandId).forEach(cardContainer => {
            this.hostGame.minDistanceBetweenCards.value = 500;
            this.hostGame.cardInHandTransform.value = { ...this.hostGame.cardInHandTransform.value, y: 200, scale: 2 };
            cardContainer.setFaceUp(true);
        });
    }

    update(time: number, delta: number): HostGameState | null {
        this.hostGame.cards.update(time, delta);
        return null;
    }

    // calculate the score for each player
    calculateScores() {
        // calculate the score for each player
        this.hostGame.hostUserAvatars?.userAvatarContainers.forEach(userAvatar => {

        });
    }

    static calculateScoreAndCardsThatMatter(cardContainers: CardContainer[]) {
        // check if all cards have same number then score is 31
        const allCardsSameNumber = cardContainers.every(c => c.cardContent.card === cardContainers[0].cardContent.card);
        if (allCardsSameNumber) {
            return
        }
        // check if all cards 
    }

    exit() {
    }
}