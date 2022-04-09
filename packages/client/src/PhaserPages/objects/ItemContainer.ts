import { CountdownTimer } from "./CountdownTimer";
import { calculateMovementFromTimer, IMoveItemOverTime, ITableItem, millisecondToSecond, PositionAndRotation } from "./Tools";

export default class ItemContainer extends Phaser.GameObjects.Container implements IMoveItemOverTime, ITableItem {
    velocity: { x: number, y: number, rotation: number } = { x: 0, y: 0, rotation: 0 };
    mass: number = 1;

    inUserHandId: string | null = null;

    // for movement over time
    startPosition: PositionAndRotation | null = null;
    endPosition: PositionAndRotation | null = null;
    movementCountdownTimer: CountdownTimer | null = null;


    public startMovingOverTimeTo(toPosition: PositionAndRotation, time: number) {
        this.velocity = { x: 0, y: 0, rotation: 0 };
        this.endPosition = toPosition;
        this.setStartPositionAsCurentPosition();
        this.movementCountdownTimer = new CountdownTimer(time);
    }

    public moveOverTime(time: number, delta: number) {
        if (!this.startPosition || !this.endPosition) return;
        if (!this.movementCountdownTimer) return;
        if (this.movementCountdownTimer.wasDone()) {
            this.startPosition = null;
            this.endPosition = null;
            this.movementCountdownTimer = null;
            return;
        }
        const movement = calculateMovementFromTimer(this.movementCountdownTimer, delta, this.startPosition, { x: this.x, y: this.y, rotation: this.rotation }, this.endPosition);
        this.x += movement.x;
        this.y += movement.y;
        this.rotation += movement.rotation;
        this.movementCountdownTimer.update(delta);
    }

    public setStartPositionAsCurentPosition() {
        this.startPosition = {
            x: this.x,
            y: this.y,
            rotation: this.rotation
        };
    }

    public moveFromVelocity(delta: number) {
        this.x += this.velocity.x * millisecondToSecond(delta);
        this.y += this.velocity.y * millisecondToSecond(delta);
        this.rotation += this.velocity.rotation * millisecondToSecond(delta);
    }

    public update(time: number, delta: number) {
        this.moveOverTime(time, delta);
        this.moveFromVelocity(delta);
    }
}