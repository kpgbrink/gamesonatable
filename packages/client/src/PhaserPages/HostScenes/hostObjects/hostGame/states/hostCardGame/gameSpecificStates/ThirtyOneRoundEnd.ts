import { CountdownTimer } from "../../../../../../objects/CountdownTimer";
import CardContainer from "../../../../../../objects/items/CardContainer";
import { ThirtyOneGame } from "../../../ThirtyOneGame";
import { HostGameState } from "../../HostGameState";
import { StartGettingReadyToShuffle } from "../StartGettingReadyToShuffle";

// Bring cards to the random dealer and have the cards start going out to people.
export class ThirtyOneRoundEnd extends HostGameState {
    hostGame: ThirtyOneGame;
    bringShownCardToPositionTime: number = 1;

    timeToNextRound: number = 10;
    // timer for starting the next round
    timerNextRound: CountdownTimer = new CountdownTimer(this.timeToNextRound);

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
        this.timerNextRound.update(delta);
        console.log('timer going down', this.timerNextRound.currentTime);
        if (this.timerNextRound.isDone()) {
            console.log('timer is done');
            this.hostGame.changeState(new StartGettingReadyToShuffle(this.hostGame));
        }
        return null;
    }

    // calculate the score for each player
    calculateScores() {
        // calculate the score for each player
        this.hostGame.hostUserAvatars?.userAvatarContainers.forEach(userAvatar => {
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
            userAvatar.roundScore = score;
            return { score, cardsThatMatter };
        });
        // get all users with the lowest score
        if (!this.hostGame.hostUserAvatars) throw new Error('no host user avatars');
        const lowestScore = Math.min(...this.hostGame.hostUserAvatars?.userAvatarContainers.map(u => u.roundScore));
        const lowestScoreUsers = this.hostGame.hostUserAvatars?.userAvatarContainers.filter(u => u.roundScore === lowestScore);
        // all users with the lowest score lose a life except for the user who knocked if there are more than 1
        // if the user who knocked is the lowest score user then they lose 2 lives
        // if a player got 31 then everyone else loses a life
        // check if there is a 31 score
        (() => {
            const thirtyOneScoreUsers = this.hostGame.hostUserAvatars?.userAvatarContainers.filter(u => u.roundScore === 31);
            if (thirtyOneScoreUsers.length > 0) {
                const nonThirtyOneScoreUsers = this.hostGame.hostUserAvatars?.userAvatarContainers.filter(u => u.roundScore !== 31);
                nonThirtyOneScoreUsers.forEach(userAvatar => {
                    userAvatar.lives -= 1;
                });
                return;
            }
            if (lowestScoreUsers.length === 1) {
                const lowestScoreUser = lowestScoreUsers[0];
                lowestScoreUser.lives -= 1;
                if (lowestScoreUser.user.id === this.hostGame.knockPlayerId) { lowestScoreUser.lives -= 1; }
                return;
            }
            lowestScoreUsers.forEach(lowestScoreUser => {
                lowestScoreUser.lives -= 1;
                if (lowestScoreUser.user.id === this.hostGame.knockPlayerId) lowestScoreUser.lives += 1;
            });
        })();

        // if only one user has lives then they win
        const usersWithLives = this.hostGame.hostUserAvatars?.userAvatarContainers.filter(u => u.lives > 0);
        if (usersWithLives.length === 1) {
            const winner = usersWithLives[0];
            // TODO go to the win state or whatever
        }
        // update the poker chips in front of each user
        this.hostGame.hostUserAvatars?.userAvatarContainers.forEach(userAvatar => {
            userAvatar.updatePokerChips();
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