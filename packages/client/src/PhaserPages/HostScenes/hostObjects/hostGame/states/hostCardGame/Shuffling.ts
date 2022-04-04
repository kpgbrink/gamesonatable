import { angleFromPositionToPosition, DegreesToRadians, distanceBetweenTwoPoints, getNormalVector, getScreenCenter, millisecondToSecond, randomFloatBetween, vectorFromAngleAndLength } from "../../../../../objects/Tools";
import { calculateDistanceAndRotationFromTable } from "../../../../tools/HostTools";
import { HostCardGame } from "../../HostCardGame";
import { HostGameState } from "../HostGameState";
import { GetReadyToDeal } from "./GetReadyToDeal";


export class Shuffling extends HostGameState {
    hostGame: HostCardGame;
    randomStartingOffset: number = 500;
    randomStartingMovementSpeed: number = 15 * 60;
    randomStartingRotationalVelocity: number = DegreesToRadians(360);
    massCenter = 50 * 60 * 60 * 4;
    shufflingTime: number = 1;

    constructor(hostGame: HostCardGame) {
        super(hostGame);
        this.hostGame = hostGame;
    }

    enter() {
        // set the card movement to randomness
        const screenCenter = getScreenCenter(this.hostGame.scene);

        // shuffle the cards
        this.hostGame.cards.shuffle();

        // set random card movement
        this.hostGame.cards.cardContainers.forEach(cardContainer => {
            // set random card offset
            cardContainer.x = screenCenter.x + randomFloatBetween(-this.randomStartingOffset, this.randomStartingOffset);
            cardContainer.y = screenCenter.y + randomFloatBetween(-this.randomStartingOffset, this.randomStartingOffset);

            // set random velocity
            const x = randomFloatBetween(-this.randomStartingMovementSpeed, this.randomStartingMovementSpeed);
            const y = randomFloatBetween(-this.randomStartingMovementSpeed, this.randomStartingMovementSpeed);
            cardContainer.velocity = { x, y };

            // set random rotational velocity
            cardContainer.rotationalVelocity = randomFloatBetween(-this.randomStartingRotationalVelocity, this.randomStartingRotationalVelocity);
        });
    }

    addGravityToCardMovement(deltaTime: number) {
        // add gravity to card movement
        const screenCenter = getScreenCenter(this.hostGame.scene);
        this.hostGame.cards.cardContainers.forEach(cardContainer => {
            // add gravity to screen center
            const distanceToScreenCenter = (() => {
                const x = cardContainer.x - screenCenter.x;
                const y = cardContainer.y - screenCenter.y;
                return { x, y };
            })();
            const distance = Math.sqrt(distanceToScreenCenter.x ** 2 + distanceToScreenCenter.y ** 2);
            // calculate gravity force
            const gravityForce = this.massCenter * cardContainer.mass / distance * 2;
            // add gravity force to velocity towards screen center
            // get normal vector to screen center from card location
            const normalVecotr = getNormalVector(-distanceToScreenCenter.x, -distanceToScreenCenter.y);
            // add normal vector to velocity
            cardContainer.velocity.x += normalVecotr.x * gravityForce * millisecondToSecond(deltaTime);
            cardContainer.velocity.y += normalVecotr.y * gravityForce * millisecondToSecond(deltaTime);

        });
    }

    keepCardsOnTable() {
        const screenCenter = getScreenCenter(this.hostGame.scene);
        this.hostGame.cards.cardContainers.forEach(cardContainer => {
            const distanceFromCenter = distanceBetweenTwoPoints(screenCenter, cardContainer);
            const { maxDistance } = calculateDistanceAndRotationFromTable(this.hostGame.scene, cardContainer);
            const distanceFromCenterToOutside = Math.min(distanceFromCenter, maxDistance - 800);
            const angleFromCenterToPosition = angleFromPositionToPosition(screenCenter, cardContainer);
            const vectorFromCenter = vectorFromAngleAndLength(angleFromCenterToPosition, distanceFromCenterToOutside);
            cardContainer.x = screenCenter.x + vectorFromCenter.x;
            cardContainer.y = screenCenter.y + vectorFromCenter.y;
        });
    }

    update(time: number, delta: number): HostGameState | null {
        // console.log('delta time', delta);
        // shuffle then switch to deal state
        this.hostGame.cards.update(time, delta);
        this.addGravityToCardMovement(delta);
        this.keepCardsOnTable();

        this.shufflingTime -= millisecondToSecond(delta);
        if (this.shufflingTime <= 0) {
            return new GetReadyToDeal(this.hostGame);
        }
        return null;
    }

    exit() {
        // on exit
    }
}