import CardContainer from "../../../../../../objects/items/CardContainer";
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

        // increate the size of the cards in player hands and make them face up
        console.log('increase the size of the cards in player hands and make them face up');
        this.hostGame.cards.cardContainers.filter(c => c.userHandId).forEach(cardContainer => {
            this.hostGame.minDistanceBetweenCards.value = 500;
            this.hostGame.cardInHandTransform.value = { ...this.hostGame.cardInHandTransform.value, scale: 1.5 };
            cardContainer.frontImage?.setTint(0x555555);
            cardContainer.setFaceUp(true);
        });
        this.calculateScores();
    }

    update(time: number, delta: number): HostGameState | null {
        this.hostGame.cards.update(time, delta);
        return null;
    }

    // calculate the score for each player
    calculateScores() {
        // calculate the score for each player
        this.hostGame.hostUserAvatars?.userAvatarContainers.map(userAvatar => {
            const cardContainers = this.hostGame.cards.cardContainers.filter(c => c.userHandId === userAvatar.user.id);
            const { score, cardsThatMatter } = ThirtyOneRoundEnd.calculateScoreAndCardsThatMatter(cardContainers);
            console.log('score', score);
            console.log('cardsThatMatter', cardsThatMatter);
            // show the cards that matter differently
            cardsThatMatter.forEach(cardContainer => {
                cardContainer.frontImage?.setTint(0xffffff);
                console.log('cardContainer', cardContainer.cardContent);
                cardContainer.cardInHandOffsetTransform.value = { ...cardContainer.cardInHandOffsetTransform.value, y: 200, scale: 2 / 1.5 };
            });
            return { score, cardsThatMatter };
        });
    }

    static calculateScoreAndCardsThatMatter(cardContainers: CardContainer[]) {
        // check if all cards have same number then score is 31
        const allCardsSameNumber = cardContainers.every(c => c.cardContent.card === cardContainers[0].cardContent.card);
        if (allCardsSameNumber) {
            return { score: 30, cardsThatMatter: cardContainers };
        }

        // add up all points of the cards for each suit
        const cardsBySuit = (() => {
            const cardsBySuit: { suit: string, score: number }[] = [];
            cardContainers.forEach(cardContainer => {
                const card = cardContainer.cardContent;
                if (!card.suit || !card.card) return;
                const suit = card.suit;
                const score = (() => {
                    if (card.card === 'Ace') return 11;
                    if (card.card === 'Jack' || card.card === 'Queen' || card.card === 'King') return 10;
                    return parseInt(card.card);
                })();
                const cardBySuit = cardsBySuit.find(c => c.suit === suit);
                if (cardBySuit) {
                    cardBySuit.score += score;
                } else {
                    cardsBySuit.push({ suit, score });
                }
            });
            return cardsBySuit;
        })();
        // get the highest score and suit
        const highestScore = Math.max(...cardsBySuit.map(c => c.score));
        const suitAndScore = cardsBySuit.find(c => c.score === highestScore);
        if (!suitAndScore) return { score: 0, cardsThatMatter: cardContainers };
        const cardsInSuit = cardContainers.filter(c => c.cardContent.suit === suitAndScore.suit);
        return { score: highestScore, cardsThatMatter: cardsInSuit };
    }

    exit() {
    }
}