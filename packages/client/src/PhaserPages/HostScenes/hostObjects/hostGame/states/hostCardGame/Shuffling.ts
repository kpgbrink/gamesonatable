import { CardGameData, PlayerCardHandData } from "api/src/data/datas/CardData";
import { CountdownTimer } from "../../../../../objects/CountdownTimer";
import { angleFromPositionToPosition, DegreesToRadians, distanceBetweenTwoPoints, getNormalVector, getScreenCenter, millisecondToSecond, randomFloatBetween, vectorFromAngleAndLength } from "../../../../../objects/Tools";
import { CardGameUserAvatarContainer } from "../../../../../objects/userAvatarContainer/CardGameUserAvatarContainer";
import { calculateDistanceAndRotationFromTable } from "../../../../hostTools/HostTools";
import { HostUserAvatarsAroundTableGame } from "../../../HostUserAvatars/HostUserAvatarsAroundTable/HostUserAvatarsAroundTableGame";
import { HostCardGame } from "../../HostCardGame";
import { HostGameState } from "../HostGameState";
import { BringCardsToDealer } from "./BringCardsToDealer";


export class Shuffling<
    GameDataType extends CardGameData,
    PlayerDataType extends PlayerCardHandData,
    UserAvatars extends HostUserAvatarsAroundTableGame<UserAvatarType>,
    UserAvatarType extends CardGameUserAvatarContainer<PlayerDataType>> extends HostGameState<PlayerDataType, GameDataType> {
    hostGame: HostCardGame<GameDataType, PlayerDataType, UserAvatars, UserAvatarType>;
    randomStartingMovementSpeed: number = 10;
    randomStartingRotationalVelocity: number = DegreesToRadians(180);
    massCenter = 50 * 60 * 60 * 4;
    shufflingTimer: CountdownTimer = new CountdownTimer(1);

    constructor(hostGame: HostCardGame<GameDataType, PlayerDataType, UserAvatars, UserAvatarType>) {
        super(hostGame);
        this.hostGame = hostGame;
    }

    enter() {
        // set random card movement
        this.hostGame.cards.cardContainers.forEach(cardContainer => {

            // set random velocity
            const x = randomFloatBetween(-this.randomStartingMovementSpeed, this.randomStartingMovementSpeed);
            const y = randomFloatBetween(-this.randomStartingMovementSpeed, this.randomStartingMovementSpeed);
            const rotation = randomFloatBetween(-this.randomStartingRotationalVelocity, this.randomStartingRotationalVelocity);
            cardContainer.velocity = { x, y, rotation };

            // set random rotational velocity
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
            const gravityForce = this.massCenter * cardContainer.mass / (distance * 2);
            // add gravity force to velocity towards screen center
            // get normal vector to screen center from card location
            const normalVecotr = getNormalVector(-distanceToScreenCenter.x, -distanceToScreenCenter.y);
            // add normal vector to velocity
            cardContainer.velocity.x += normalVecotr.x * gravityForce * millisecondToSecond(deltaTime) / 5;
            cardContainer.velocity.y += normalVecotr.y * gravityForce * millisecondToSecond(deltaTime) / 5;

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

    update(time: number, delta: number): HostGameState<PlayerDataType, GameDataType> | null {
        // shuffle then switch to deal state
        this.hostGame.cards.update(time, delta);
        this.addGravityToCardMovement(delta);
        this.keepCardsOnTable();

        this.shufflingTimer.update(delta);
        if (this.shufflingTimer.isDone()) {
            return new BringCardsToDealer(this.hostGame);
        }
        return null;
    }

    exit() {
        // on exit
    }
}